import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@clerk/nextjs/server'
import { client } from '@/sanity/lib/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: '2023-10-16' as any,
})

export async function POST(req: Request) {
  try {
    const { items } = await req.json()
    const { userId } = await auth()

    if (!items || items.length === 0) {
      return new NextResponse('Cart is empty', { status: 400 })
    }

    const writeClient = client.withConfig({ token: process.env.SANITY_WRITE_TOKEN })

    // 1. Fetch current authentic stock for all items
    const wineIds = items.map((item: any) => item.id)
    const winesInDb = await writeClient.fetch(`*[_type == "wine" && _id in $wineIds] { _id, physical_stock, committed_stock, title }`, { wineIds })

    // 2. Map and Verify Stock Mathematically 
    const tx = writeClient.transaction()
    for (const item of items) {
      const dbWine = winesInDb.find((w: any) => w._id === item.id)
      if (!dbWine) {
        return NextResponse.json({ error: `Invalid product: ${item.title}` }, { status: 400 })
      }
      
      const available = (dbWine.physical_stock || 0) - (dbWine.committed_stock || 0)
      if (available < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${item.title}. Only ${Math.max(0, available)} available.` }, { status: 400 })
      }
      
      // Stage the increment mutation to softly reserve this inventory mathematically
      tx.patch(item.id, p => p.inc({ committed_stock: item.quantity }))
    }

    // 3. Commit the soft lock transaction to Sanity
    try {
      await tx.commit()
    } catch (err) {
      console.error('Failed to commit inventory soft lock:', err)
      return NextResponse.json({ error: 'High traffic error: Unable to secure inventory lock. Please try again.' }, { status: 409 })
    }

    // 4. Build proper Stripe line abstractions
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: item.imageUrl ? [item.imageUrl] : [],
          metadata: { wine_id: item.id }
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }))

    // 5. Secure Stripe Sessions Gateway 
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/cart`,
        metadata: {
          clerkUserId: userId || 'guest',
        },
        // Force the checkout portal to expire mathematically in exactly 30 minutes!
        expires_at: Math.floor(Date.now() / 1000) + (30 * 60)
      })
    } catch (stripeErr) {
      console.error('Stripe Session Failed, Reverting Soft Locks...');
      // Revert the Sanity locks since Stripe couldn't secure the payment route, freeing the item natively.
      const revertTx = writeClient.transaction()
      for (const item of items) {
        revertTx.patch(item.id, p => p.dec({ committed_stock: item.quantity }))
      }
      await revertTx.commit()
      
      return NextResponse.json({ error: 'Payment gateway failed to initialize. Stock locks reverted.' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe Checkout Route Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
