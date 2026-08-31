import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSamplePdf } from '@/lib/pdf';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  const { planId } = await params;

  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }

  const samplePdfBytes = await generateSamplePdf({
    title: plan.title,
    style: plan.style,
    sqm: plan.sqm,
    bedrooms: plan.bedrooms,
    bathrooms: plan.bathrooms,
    dimensions: `${plan.widthM}m W x ${plan.depthM}m D`,
  });

  return new NextResponse(new Uint8Array(samplePdfBytes), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${plan.slug}-sample-watermarked-plan.pdf"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
