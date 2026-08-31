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

  if (filter.minSqft !== undefined || filter.maxSqft !== undefined) {
    where.sqft = {};
    if (filter.minSqft !== undefined) where.sqft.gte = filter.minSqft;
    if (filter.maxSqft !== undefined) where.sqft.lte = filter.maxSqft;
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

  if (filter.minWidthFt || filter.maxWidthFt) {
    where.widthFt = {};
    if (filter.minWidthFt) where.widthFt.gte = filter.minWidthFt;
    if (filter.maxWidthFt) where.widthFt.lte = filter.maxWidthFt;
  }

  if (filter.minDepthFt || filter.maxDepthFt) {
    where.depthFt = {};
    if (filter.minDepthFt) where.depthFt.gte = filter.minDepthFt;
    if (filter.maxDepthFt) where.depthFt.lte = filter.maxDepthFt;
  }

  // Sorting
  let orderBy: any = { createdAt: 'desc' };
  if (filter.sortBy === 'price-asc') orderBy = { price: 'asc' };
  if (filter.sortBy === 'price-desc') orderBy = { price: 'desc' };
  if (filter.sortBy === 'sqft-asc') orderBy = { sqft: 'asc' };
  if (filter.sortBy === 'sqft-desc') orderBy = { sqft: 'desc' };

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
