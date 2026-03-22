import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { client } from '@/sanity/lib/client'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local')
  }

  // Get the headers from Next.js 15
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no identifying headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- missing svix headers', {
      status: 400,
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  // Verify the payload using Svix
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying Clerk webhook:', err)
    return new Response('Error verifying webhook signature', {
      status: 400,
    })
  }

  // Handle the 'user.created' event to generate the Sanity Shadow Profile
  if (evt.type === 'user.created') {
    const { id: clerkId, email_addresses, first_name, last_name } = evt.data
    const primaryEmail = email_addresses?.[0]?.email_address || ''

    // Safely combine name or fallback to the email prefix
    let fullName = [first_name, last_name].filter(Boolean).join(' ').trim()
    if (!fullName && primaryEmail) {
      fullName = primaryEmail.split('@')[0]
    } else if (!fullName) {
      fullName = 'Unknown Customer'
    }

    try {
      // Create an authorized write client. This requires SANITY_WRITE_TOKEN in .env.local
      const writeClient = client.withConfig({
        token: process.env.SANITY_WRITE_TOKEN,
      })

      // The createIfNotExists mutation ensures we don't accidentally duplicate
      await writeClient.createIfNotExists({
        _id: `customer-${clerkId}`,
        _type: 'customer',
        clerkId,
        email: primaryEmail,
        fullName,
      })

      console.log(`Successfully created shadow profile in Sanity for user ${clerkId}`)
    } catch (error) {
      console.error('Error creating shadow profile in Sanity:', error)
      return NextResponse.json({ error: 'Failed to create Sanity profile' }, { status: 500 })
    }
  }

  return new Response('Webhook processed successfully', { status: 200 })
}
