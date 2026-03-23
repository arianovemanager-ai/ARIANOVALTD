import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { client } from '@/sanity/lib/client'

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: '2023-10-16' as any,
})

/**
 * CRON: Inventory Safety Net
 * Reconciles inventory for recently expired or canceled Stripe sessions 
 * that might have missed their webhook trigger (e.g. during a server deploy).
 */
export async function GET(req: Request) {
  const stripe = getStripe()
  // Security Check
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    console.log('扫 [Cron] Starting Safety Net reconciliation...');
    
    // 1. Fetch recently closed sessions (expired) from the last 2 hours
    // This avoids the '100 newest' limit issue by using a temporal filter
    const twoHoursAgo = Math.floor(Date.now() / 1000) - (2 * 60 * 60);
    
    const expiredSessions = await stripe.checkout.sessions.list({
      status: 'expired',
      created: { gt: twoHoursAgo },
      limit: 100,
    });

    const sessionsToReconcile = expiredSessions.data;
    const writeClient = client.withConfig({ token: process.env.SANITY_WRITE_TOKEN });
    
    let reconciledCount = 0;

    for (const session of sessionsToReconcile) {
      const sessionId = session.id;
      const idempotencyId = `processed-session-${sessionId}`;

      // 2. Check if this session was already processed (Webhook usually wins)
      const existing = await client.fetch(`*[_id == $id][0]`, { id: idempotencyId });
      if (existing) continue;

      console.log(`📡 [Cron] Reconciling inventory for missed session: ${sessionId}`);

      try {
        // METADATA SHORTCUT: Parse cart directly from session metadata
        const serializedCart = session.metadata?.serializedCart;
        if (!serializedCart) {
          console.warn(`[Cron] No serializedCart found for session ${sessionId}. Skipping reconciliation.`);
          continue;
        }
        const cart = JSON.parse(serializedCart);

        // 3. Reconcile inventory atomically
        const tx = writeClient.transaction().create({
          _id: idempotencyId,
          _type: 'sessionRecord',
          sessionId,
          status: session.status || 'expired',
          processedAt: new Date().toISOString()
        });

        for (const item of cart) {
          tx.patch(item.id, p => p.dec({ committed_stock: item.qty }));
        }

        await tx.commit();
        reconciledCount++;
      } catch (reconErr: any) {
        // Handle race conditions if webhook hits while cron is running
        if (reconErr.statusCode === 409) continue;
        console.error(`❌ [Cron] Reconciliation failed for ${sessionId}:`, reconErr);
      }
    }

    console.log(`✅ [Cron] Safety Net complete. Reconciled ${reconciledCount} orphaned locks.`);
    
    return NextResponse.json({ 
      success: true, 
      processed: sessionsToReconcile.length, 
      reconciled: reconciledCount 
    });

  } catch (error: any) {
    console.error('❌ [Cron Error] Safety Net failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
