import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CatalogFilterSchema } from '@/lib/validators';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateCheck = checkRateLimit(`catalog_${ip}`, 60, 60000);
  if (!rateCheck.success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const rawParams = Object.fromEntries(searchParams.entries());
  
  const parsed = CatalogFilterSchema.safeParse(rawParams);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters', details: parsed.error.format() }, { status: 400 });
  }

  const filter = parsed.data;

  // Build Prisma query condition
  const where: any = {
    isPublished: true,
  };

  if (filter.search) {
    where.OR = [
      { title: { contains: filter.search } },
      { description: { contains: filter.search } },
      { style: { contains: filter.search } },
    ];
  }

  if (filter.minSqm !== undefined || filter.maxSqm !== undefined) {
    where.sqm = {};
    if (filter.minSqm !== undefined) where.sqm.gte = filter.minSqm;
    if (filter.maxSqm !== undefined) where.sqm.lte = filter.maxSqm;
  }

  if (filter.bedrooms) {
    where.bedrooms = { gte: filter.bedrooms };
  }

  if (filter.bathrooms) {
    where.bathrooms = { gte: filter.bathrooms };
  }

  if (filter.stories) {
    where.stories = filter.stories;
  }

  if (filter.style && filter.style !== 'ALL') {
    where.style = filter.style;
  }

  if (filter.foundationType && filter.foundationType !== 'ALL') {
    where.foundationType = filter.foundationType;
  }

  if (filter.minWidthM || filter.maxWidthM) {
    where.widthM = {};
    if (filter.minWidthM) where.widthM.gte = filter.minWidthM;
    if (filter.maxWidthM) where.widthM.lte = filter.maxWidthM;
  }

  if (filter.minDepthM || filter.maxDepthM) {
    where.depthM = {};
    if (filter.minDepthM) where.depthM.gte = filter.minDepthM;
    if (filter.maxDepthM) where.depthM.lte = filter.maxDepthM;
  }

  // Sorting
  let orderBy: any = { createdAt: 'desc' };
  if (filter.sortBy === 'price-asc') orderBy = { price: 'asc' };
  if (filter.sortBy === 'price-desc') orderBy = { price: 'desc' };
  if (filter.sortBy === 'sqm-asc') orderBy = { sqm: 'asc' };
  if (filter.sortBy === 'sqm-desc') orderBy = { sqm: 'desc' };

  try {
    const plans = await prisma.plan.findMany({
      where,
      orderBy,
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return NextResponse.json({ success: true, count: plans.length, data: plans });
  } catch (err: any) {
    return NextResponse.json({ error: 'Database query error', details: err?.message }, { status: 500 });
  }
}
