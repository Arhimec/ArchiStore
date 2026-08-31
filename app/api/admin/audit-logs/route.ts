import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized Admin Access' }, { status: 401 });
  }

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    include: {
      token: {
        include: {
          order: true,
        },
      },
    },
    take: 100,
  });

  return NextResponse.json({ success: true, count: auditLogs.length, data: auditLogs });
}
