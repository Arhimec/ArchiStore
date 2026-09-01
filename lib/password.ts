import crypto from 'crypto';

/**
 * Hashes a plain-text password using PBKDF2 with SHA-512 and a 16-byte salt.
 */
export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
    .toString('hex');
  return { hash, salt };
}

/**
 * Verifies a plain-text password against a stored PBKDF2 hash and salt using constant-time comparison.
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const { hash } = hashPassword(password, salt);
    const hashBuf = Buffer.from(hash, 'hex');
    const storedBuf = Buffer.from(storedHash, 'hex');

    if (hashBuf.length !== storedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(hashBuf, storedBuf);
  } catch (err) {
    return false;
  }
}
