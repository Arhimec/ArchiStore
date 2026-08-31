import { describe, it, expect } from 'vitest';
import { verifyStripeWebhookSignature, createMockStripeWebhookHeader } from '@/lib/stripe';

describe('Stripe Webhook Signature Verification', () => {
  it('validates authentic webhook signature correctly', () => {
    const rawBody = JSON.stringify({
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_test_123' } },
    });

    const secret = 'whsec_test_secret_key_999';
    const header = createMockStripeWebhookHeader(rawBody, secret);

    const isValid = verifyStripeWebhookSignature(rawBody, header, secret);
    expect(isValid).toBe(true);
  });

  it('rejects tampered webhook body or wrong signature secret', () => {
    const rawBody = JSON.stringify({
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_test_123' } },
    });

    const secret = 'whsec_test_secret_key_999';
    const header = createMockStripeWebhookHeader(rawBody, secret);

    const tamperedBody = JSON.stringify({
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_test_TAMPERED' } },
    });

    const isValid = verifyStripeWebhookSignature(tamperedBody, header, secret);
    expect(isValid).toBe(false);
  });

  it('rejects missing or empty signature headers', () => {
    const rawBody = JSON.stringify({ type: 'test' });
    expect(verifyStripeWebhookSignature(rawBody, null)).toBe(false);
  });
});
