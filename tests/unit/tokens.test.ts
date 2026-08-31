import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import crypto from 'crypto';

const SECRET_KEY = 'test_jwt_secret_key_12345';

interface TokenPayload {
  orderId: string;
  planId: string;
  expiresAt: number;
  nonce: string;
}

function generateTestToken(payload: TokenPayload, secret = SECRET_KEY): string {
  const payloadString = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('base64url');
  return `${payloadString}.${signature}`;
}

function verifyTestToken(tokenString: string, secret = SECRET_KEY): { valid: boolean; payload?: TokenPayload; reason?: string } {
  const parts = tokenString.split('.');
  if (parts.length !== 2) return { valid: false, reason: 'Malformed' };

  const [payloadString, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expectedSigBuf = Buffer.from(expectedSig);

  if (sigBuf.length !== expectedSigBuf.length || !crypto.timingSafeEqual(sigBuf, expectedSigBuf)) {
    return { valid: false, reason: 'Invalid Signature' };
  }

  const payload: TokenPayload = JSON.parse(Buffer.from(payloadString, 'base64url').toString('utf-8'));
  if (Date.now() > payload.expiresAt) {
    return { valid: false, payload, reason: 'Expired' };
  }

  return { valid: true, payload };
}

describe('Cryptographic Download Token Logic', () => {
  it('generates and verifies valid token successfully', () => {
    const payload: TokenPayload = {
      orderId: 'order_123',
      planId: 'plan_abc',
      expiresAt: Date.now() + 72 * 3600 * 1000,
      nonce: 'random_nonce_123',
    };

    const token = generateTestToken(payload);
    const result = verifyTestToken(token);

    expect(result.valid).toBe(true);
    expect(result.payload?.orderId).toBe('order_123');
  });

  it('rejects tampered or forged token signatures', () => {
    const payload: TokenPayload = {
      orderId: 'order_123',
      planId: 'plan_abc',
      expiresAt: Date.now() + 72 * 3600 * 1000,
      nonce: 'random_nonce_123',
    };

    const validToken = generateTestToken(payload);
    const tamperedToken = validToken + 'tampered';

    const result = verifyTestToken(tamperedToken);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Invalid Signature');
  });

  it('rejects expired download tokens', () => {
    const expiredPayload: TokenPayload = {
      orderId: 'order_123',
      planId: 'plan_abc',
      expiresAt: Date.now() - 1000, // Expired 1 second ago
      nonce: 'random_nonce_123',
    };

    const token = generateTestToken(expiredPayload);
    const result = verifyTestToken(token);

    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Expired');
  });
});
