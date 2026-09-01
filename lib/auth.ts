import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { prisma } from './prisma';
import { verifyPassword } from './password';

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'archistore_admin_secure_session_secret_key_2026';

interface AdminTokenPayload {
  role: 'admin';
  expiresAt: number;
  nonce: string;
}

/**
 * Creates a cryptographically signed HMAC admin session token valid for 24 hours.
 */
export function createAdminSessionToken(): string {
  const payload: AdminTokenPayload = {
    role: 'admin',
    expiresAt: Date.now() + 24 * 3600 * 1000, // 24 hours
    nonce: crypto.randomBytes(16).toString('hex'),
  };

  const payloadString = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadString)
    .digest('base64url');

  return `${payloadString}.${signature}`;
}

/**
 * Verifies a signed HMAC admin session token.
 */
export function verifyAdminSessionToken(tokenString: string): boolean {
  try {
    const parts = tokenString.split('.');
    if (parts.length !== 2) return false;

    const [payloadString, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadString)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return false;
    }

    const payload: AdminTokenPayload = JSON.parse(Buffer.from(payloadString, 'base64url').toString('utf-8'));
    if (Date.now() > payload.expiresAt || payload.role !== 'admin') {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Verifies admin password against encrypted PBKDF2 hash stored in database.
 */
export async function verifyAdminLogin(password: string): Promise<boolean> {
  if (!password || typeof password !== 'string') {
    return false;
  }

  try {
    const adminUser = await prisma.adminUser.findFirst();
    if (!adminUser || !adminUser.passwordHash || !adminUser.salt) {
      return false;
    }

    return verifyPassword(password, adminUser.passwordHash, adminUser.salt);
  } catch (err) {
    console.error('Error verifying admin login:', err);
    return false;
  }
}

/**
 * Checks if incoming request contains a valid admin session cookie or token header.
 */
export function isAdminAuthenticated(req: NextRequest): boolean {
  // Check cookie
  const cookieSession = req.cookies.get('admin_session')?.value;
  if (cookieSession && verifyAdminSessionToken(cookieSession)) {
    return true;
  }

  // Check Authorization Bearer header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    if (verifyAdminSessionToken(token)) {
      return true;
    }
  }

  // Check custom session header
  const customHeader = req.headers.get('x-admin-session');
  if (customHeader && verifyAdminSessionToken(customHeader)) {
    return true;
  }

  return false;
}
