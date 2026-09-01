import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminLogin, createAdminSessionToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateCheck = checkRateLimit(`admin_login_${ip}`, 5, 60000); // 5 attempts per min max
  if (!rateCheck.success) {
    return NextResponse.json({ error: 'Too many login attempts. Please wait 1 minute.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const isValid = await verifyAdminLogin(password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid admin password' }, { status: 401 });
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({ success: true, message: 'Authentication successful', token });

    response.cookies.set({
      name: 'admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 3600, // 24 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Login verification failed', message: err?.message }, { status: 500 });
  }
}
