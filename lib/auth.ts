import { NextRequest } from 'next/server';

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'admin1234';

/**
 * Checks if request has valid admin credentials in headers or cookies.
 */
export function isAdminAuthenticated(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader === `Bearer ${ADMIN_PASSCODE}`) {
    return true;
  }

  const cookiePasscode = req.cookies.get('admin_passcode')?.value;
  if (cookiePasscode === ADMIN_PASSCODE) {
    return true;
  }

  // Also support custom header for API clients
  const customHeader = req.headers.get('x-admin-passcode');
  if (customHeader === ADMIN_PASSCODE) {
    return true;
  }

  return false;
}
