import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyStripeWebhookSignature } from '@/lib/stripe';
import { createDownloadToken } from '@/lib/tokens';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  // Cryptographic signature check
  const isValidSig = verifyStripeWebhookSignature(rawBody, signature);
  if (!isValidSig) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
    const session = event.data.object;
    const sessionId = session.id;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ stripeSessionId: sessionId }, { id: sessionId }],
      },
      include: {
        items: true,
      },
    });

    if (order && order.status !== 'COMPLETED') {
      // Update order status to COMPLETED
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          customerEmail: session.customer_email || order.customerEmail,
        },
      });

      // Generate secure download tokens for each item in the order
      for (const item of order.items) {
        await createDownloadToken(order.id, item.planId, 72, 3);
      }
    }
  }

  return NextResponse.json({ received: true, type: event.type });
}
