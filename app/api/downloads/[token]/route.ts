import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { verifyAndConsumeToken } from '@/lib/tokens';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  const userAgent = req.headers.get('user-agent') || undefined;

  // Rate limiting check on download route (max 15 attempts per min per IP)
  const rateCheck = checkRateLimit(`download_${ip}`, 15, 60000);
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: 'Too many download requests. Please wait a minute.' },
      { status: 429 }
    );
  }

  const result = await verifyAndConsumeToken(token, ip, userAgent);

  if (!result.valid) {
    return NextResponse.json(
      {
        error: 'Forbidden Access',
        status: result.status,
        message: result.errorMessage || 'Invalid or expired download link',
      },
      { status: 403 }
    );
  }

  const privateStoragePath = process.env.PRIVATE_STORAGE_PATH || './private_storage';
  const filePath = path.resolve(process.cwd(), privateStoragePath, result.pdfFileName!);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: 'File Not Found', message: 'The requested construction PDF set is unavailable.' },
      { status: 404 }
    );
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(new Uint8Array(fileBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${result.pdfFileName}"`,
      'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
