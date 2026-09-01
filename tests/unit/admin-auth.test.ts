import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/password';
import { createAdminSessionToken, verifyAdminSessionToken } from '@/lib/auth';

describe('Encrypted Admin Database Auth & Session Tokens', () => {
  it('hashes password with PBKDF2 SHA-512 and verifies correct password DoamneAjuta2026', () => {
    const rawPassword = 'DoamneAjuta2026';
    const { hash, salt } = hashPassword(rawPassword);

    expect(hash).toBeDefined();
    expect(hash.length).toBe(128); // 64 bytes in hex
    expect(salt).toBeDefined();
    expect(salt.length).toBe(32); // 16 bytes in hex

    // Verify correct password returns true
    const isValid = verifyPassword('DoamneAjuta2026', hash, salt);
    expect(isValid).toBe(true);

    // Verify wrong password returns false
    const isWrongValid = verifyPassword('WrongPassword123', hash, salt);
    expect(isWrongValid).toBe(false);
  });

  it('creates and verifies cryptographically signed HMAC session tokens', () => {
    const token = createAdminSessionToken();
    expect(token).toBeDefined();
    expect(token.includes('.')).toBe(true);

    // Verify session token is valid
    const isValidToken = verifyAdminSessionToken(token);
    expect(isValidToken).toBe(true);

    // Tampered token must be rejected
    const tamperedToken = token + 'tampered';
    expect(verifyAdminSessionToken(tamperedToken)).toBe(false);

    // Invalid string must be rejected
    expect(verifyAdminSessionToken('invalid.token.structure')).toBe(false);
  });
});
