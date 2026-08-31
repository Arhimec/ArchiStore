import crypto from 'crypto';
import { prisma } from './prisma';

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_key_archistore_2026';

export interface TokenPayload {
  orderId: string;
  planId: string;
  expiresAt: number; // Unix timestamp in ms
  nonce: string;
}

/**
 * Creates a cryptographically signed token string and persists a DownloadToken record in the database.
 */
export async function createDownloadToken(
  orderId: string,
  planId: string,
  expiresInHours = 72,
  maxDownloads = 3
): Promise<string> {
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
  const nonce = crypto.randomBytes(16).toString('hex');
  
  const payload: TokenPayload = {
    orderId,
    planId,
    expiresAt: expiresAt.getTime(),
    nonce,
  };

  const payloadString = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payloadString)
    .digest('base64url');

  const tokenString = `${payloadString}.${signature}`;

  // Persist record in database for audit trail and download count tracking
  await prisma.downloadToken.create({
    data: {
      token: tokenString,
      orderId,
      planId,
      expiresAt,
      maxDownloads,
      downloadCount: 0,
    },
  });

  return tokenString;
}

/**
 * Verifies a token string cryptographically and against the database.
 */
export async function verifyAndConsumeToken(
  tokenString: string,
  ipAddress: string,
  userAgent?: string
): Promise<{
  valid: boolean;
  status: 'VALID' | 'EXPIRED' | 'MAX_DOWNLOADS_EXCEEDED' | 'INVALID_SIGNATURE' | 'NOT_FOUND';
  planId?: string;
  pdfFileName?: string;
  orderId?: string;
  errorMessage?: string;
}> {
  try {
    const parts = tokenString.split('.');
    if (parts.length !== 2) {
      return { valid: false, status: 'INVALID_SIGNATURE', errorMessage: 'Malformed download token' };
    }

    const [payloadString, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payloadString)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expectedSigBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expectedSigBuf.length || !crypto.timingSafeEqual(sigBuf, expectedSigBuf)) {
      return { valid: false, status: 'INVALID_SIGNATURE', errorMessage: 'Invalid token signature' };
    }

    const payload: TokenPayload = JSON.parse(Buffer.from(payloadString, 'base64url').toString('utf-8'));

    // Find DB record
    const dbToken = await prisma.downloadToken.findUnique({
      where: { token: tokenString },
      include: {
        order: true,
      },
    });

    if (!dbToken) {
      return { valid: false, status: 'NOT_FOUND', errorMessage: 'Token not found or revoked' };
    }

    // Check Expiration
    if (new Date() > dbToken.expiresAt) {
      await prisma.auditLog.create({
        data: {
          tokenId: dbToken.id,
          ipAddress,
          userAgent: userAgent || null,
          action: 'EXPIRED_ATTEMPT',
        },
      });
      return { valid: false, status: 'EXPIRED', errorMessage: 'Download link has expired (72-hour limit reached)' };
    }

    // Check Download Count Limit
    if (dbToken.downloadCount >= dbToken.maxDownloads) {
      await prisma.auditLog.create({
        data: {
          tokenId: dbToken.id,
          ipAddress,
          userAgent: userAgent || null,
          action: 'MAX_DOWNLOADS_EXCEEDED',
        },
      });
      return { valid: false, status: 'MAX_DOWNLOADS_EXCEEDED', errorMessage: 'Maximum download limit (3 attempts) reached for this link' };
    }

    // Fetch Plan PDF filename
    const plan = await prisma.plan.findUnique({
      where: { id: payload.planId },
    });

    if (!plan) {
      return { valid: false, status: 'NOT_FOUND', errorMessage: 'Associated architectural plan not found' };
    }

    // Valid consume attempt: increment download count & record audit log
    await prisma.downloadToken.update({
      where: { id: dbToken.id },
      data: {
        downloadCount: { increment: 1 },
      },
    });

    await prisma.auditLog.create({
      data: {
        tokenId: dbToken.id,
        ipAddress,
        userAgent: userAgent || null,
        action: 'DOWNLOAD_SUCCESS',
      },
    });

    return {
      valid: true,
      status: 'VALID',
      planId: plan.id,
      pdfFileName: plan.pdfFileName,
      orderId: payload.orderId,
    };
  } catch (err: any) {
    return { valid: false, status: 'INVALID_SIGNATURE', errorMessage: err?.message || 'Token verification failed' };
  }
}
