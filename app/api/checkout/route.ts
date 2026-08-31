import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CheckoutRequestSchema } from '@/lib/validators';
import { stripe } from '@/lib/stripe';
import { checkRateLimit } from '@/lib/rate-limit';
import { createDownloadToken } from '@/lib/tokens';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateCheck = checkRateLimit(`checkout_${ip}`, 10, 60000);
  if (!rateCheck.success) {
    return NextResponse.json({ error: 'Too many checkout attempts. Please wait a minute.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = CheckoutRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: parsed.error.issues[0]?.message || 'Invalid checkout payload',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { planId, customerEmail, customerName } = parsed.data;

    // Fetch plan
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 444 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // If Stripe secret key is mock or test simulation mode
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('mock')) {
      // Create completed order for test mode
      const order = await prisma.order.create({
        data: {
          stripeSessionId: `mock_session_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          customerEmail,
          customerName: customerName || 'Customer',
          totalAmount: plan.price,
          status: 'COMPLETED',
          items: {
            create: [
              {
                planId: plan.id,
                price: plan.price,
              },
            ],
          },
        },
      });

      // Generate secure download token immediately for instant delivery
      await createDownloadToken(order.id, plan.id, 72, 3);

      return NextResponse.json({
        success: true,
        mode: 'test_simulation',
        sessionId: order.stripeSessionId,
        url: `${appUrl}/checkout/success?session_id=${order.stripeSessionId}`,
      });
    }

    // Real Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.title} - Architectural Stock Plan (Single-Build License)`,
              description: `${plan.sqft} SQ FT, ${plan.bedrooms} Bed, ${plan.bathrooms} Bath - Construction PDF Set`,
              images: plan.images?.[0]?.url ? [plan.images[0].url] : [],
            },
            unit_amount: Math.round(plan.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      metadata: {
        planId: plan.id,
        licenseAcknowledgedAt: new Date().toISOString(),
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/plans/${plan.slug}?canceled=true`,
    });

    // Save pending order
    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        customerEmail,
        customerName: customerName || null,
        totalAmount: plan.price,
        status: 'PENDING',
        items: {
          create: [
            {
              planId: plan.id,
              price: plan.price,
            },
          ],
        },
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Checkout creation failed', message: err?.message }, { status: 500 });
  }
}
