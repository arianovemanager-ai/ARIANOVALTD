import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { client } from '@/sanity/lib/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') as string

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event

  try {
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is missing from .env.local')
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // --- 1. FINALIZED PAYMENTS (Deduct Physical and Release Soft Lock) ---
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log(`\n✅ [Stripe Webhook] Verified successful checkout for session: ${session.id}`)

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      const clerkUserId = session.metadata?.clerkUserId

      const customerPrefix = (clerkUserId && clerkUserId !== 'guest') ? `customer-${clerkUserId}` : undefined
      
      const writeClient = client.withConfig({ token: process.env.SANITY_WRITE_TOKEN })
      const sanityOrderItems = []
      const emailItems = []

      for (const item of lineItems.data) {
        const productId = item.price?.product as string
        if (!productId) continue;

        const product = await stripe.products.retrieve(productId)
        const wineId = product.metadata?.wine_id
        
        if (wineId) {
          const qty = item.quantity || 1
          console.log(`📦 [Sanity Mutation] Finalizing ${qty} physical inventory for wine: ${wineId}`)
          
          await writeClient.patch(wineId)
            .dec({
              physical_stock: qty,
              committed_stock: qty // Release the hold because payment officially cleared!
            })
            .commit()

          sanityOrderItems.push({
            _key: Math.random().toString(36).substring(7),
            _type: 'orderItem',
            wine: { _type: 'reference', _ref: wineId },
            quantity: qty,
            priceAtPurchase: item.price?.unit_amount || 0,
          })
          
          emailItems.push({
            title: product.name || 'Arianova Curated Vintage',
            quantity: qty,
            price: item.price?.unit_amount || 0,
          })
        }
      }

      console.log(`🧾 [Sanity Mutation] Creating new Order document`)
      const orderNumber = session.id.slice(-8).toUpperCase();
      
      await writeClient.create({
        _type: 'order',
        orderNumber: orderNumber,
        stripeSessionId: session.id,
        customer: customerPrefix ? { _type: 'reference', _ref: customerPrefix } : undefined,
        totalAmount: session.amount_total,
        status: 'Processing',
        items: sanityOrderItems,
      })

      console.log(`🎉 [Success] Stripe checkout mapped natively to Inventory Logic!`)
      
      // --- ENVIRONMENT-GATED TRANSACTIONAL EMAILS ---
      if (process.env.ENABLE_EMAILS === 'true') {
        try {
          // Dynamic import bridging to prevent blowing up core webhooks if module is missing
          const { Resend } = await import('resend');
          // @ts-ignore
          const ReceiptEmail = (await import('@/emails/ReceiptEmail')).default;
          
          const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');
          const customerName = session.customer_details?.name || 'Valued Collector';
          const email = session.customer_details?.email;
          
          if (email) {
            console.log(`✉️ [Resend API] Dispatching verified digital receipt to ${email}`);
            
            // Resend API returns an error object, it doesn't always throw a JS exception!
            const { data, error: resendError } = await resend.emails.send({
              from: 'Arianova Estate <onboarding@resend.dev>', // Free tier fallback domain
              to: email,
              subject: `Your Arianova Allocation - Order #${orderNumber}`,
              react: ReceiptEmail({
                orderNumber,
                customerName,
                totalAmount: session.amount_total || 0,
                sessionId: session.id,
                items: emailItems,
                appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
              })
            });
            
            if (resendError) {
              console.error(`❌ [Resend API Error]: Delivery rejected.`, resendError);
            } else {
              console.log(`✅ [Success] Digital receipt transmitted flawlessly! ID: ${data?.id}`);
            }
          }
        } catch (emailErr) {
          console.error(`❌ [Email Error] Resend Engine Failed, but Order was mapped safely:`, emailErr);
        }
      } else {
        console.log(`💤 [Resend API] ENABLE_EMAILS is missing or false. Skipping digital receipt transmission.`);
      }
      
    } catch (error) {
      console.error('❌ [Error] Failed to mutate Sanity backend on Completion:', error)
      return new NextResponse('Sanity Webhook Engine Failed', { status: 500 })
    }
  }

  // --- 2. ABANDONED CARTS (Release Soft Lock Only) ---
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log(`\n⏳ [Stripe Webhook] Session Expired: ${session.id}. Reverting locks safely...`)

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      const writeClient = client.withConfig({ token: process.env.SANITY_WRITE_TOKEN })

      for (const item of lineItems.data) {
        const productId = item.price?.product as string
        if (!productId) continue;

        const product = await stripe.products.retrieve(productId)
        const wineId = product.metadata?.wine_id
        
        if (wineId) {
          const qty = item.quantity || 1
          console.log(`🔓 [Sanity Mutation] Releasing ${qty} committed bounds for wine: ${wineId}`)
          
          await writeClient.patch(wineId)
            .dec({ committed_stock: qty }) // Purely release the hold dynamically, retaining physical stock
            .commit()
        }
      }
      console.log(`✅ [Success] Abandoned Locks Released natively!`)
    } catch (error) {
      console.error('❌ [Error] Failed to release inventory bounds on abandon:', error)
      return new NextResponse('Sanity Webhook Engine Failed', { status: 500 })
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
