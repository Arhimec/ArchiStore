import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createDownloadToken } from '@/lib/tokens';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized Admin Access' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, planId } = body;

    if (!orderId || !planId) {
      return NextResponse.json({ error: 'orderId and planId are required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Generate new 72h download token
    const tokenString = await createDownloadToken(orderId, planId, 72, 3);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const downloadUrl = `${appUrl}/api/downloads/${tokenString}`;

    return NextResponse.json({
      success: true,
      message: 'New 72-hour download link regenerated successfully',
      token: tokenString,
      downloadUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Regeneration failed', message: err?.message }, { status: 500 });
  }
}
