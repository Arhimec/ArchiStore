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
    sqft: plan.sqft,
    bedrooms: plan.bedrooms,
    bathrooms: plan.bathrooms,
    dimensions: `${plan.widthFt}' W x ${plan.depthFt}' D`,
  });

  return new NextResponse(samplePdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${plan.slug}-sample-watermarked-plan.pdf"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
