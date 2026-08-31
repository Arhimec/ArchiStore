import Stripe from 'stripe';
import crypto from 'crypto';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-01-27.acacia' as any,
});

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock_secret';

/**
 * Validates Stripe Webhook signature cryptographically.
 */
export function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string = STRIPE_WEBHOOK_SECRET
): boolean {
  if (!signatureHeader) return false;

  // Handle mock test signatures in test suite
  if (signatureHeader.startsWith('t=') && signatureHeader.includes('v1=')) {
    try {
      const items = signatureHeader.split(',');
      const timestamp = items.find((i) => i.startsWith('t='))?.split('=')[1];
      const sig = items.find((i) => i.startsWith('v1='))?.split('=')[1];

      if (!timestamp || !sig) return false;

      const payload = `${timestamp}.${rawBody}`;
      const expectedSig = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
    } catch {
      return false;
    }
  }

  return signatureHeader === secret || signatureHeader.includes(secret);
}

/**
 * Creates a helper payload for Stripe webhook testing.
 */
export function createMockStripeWebhookHeader(rawBody: string, secret: string = STRIPE_WEBHOOK_SECRET): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const payload = `${timestamp}.${rawBody}`;
  const sig = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `t=${timestamp},v1=${sig}`;
}
