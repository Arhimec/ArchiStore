import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PlanCreateSchema } from '@/lib/validators';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized Admin Access' }, { status: 401 });
  }

  const plans = await prisma.plan.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: true, orderItems: true },
  });

  return NextResponse.json({ success: true, count: plans.length, data: plans });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized Admin Access' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = PlanCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation Error', details: parsed.error.format() }, { status: 400 });
    }

    const { images, ...planData } = parsed.data;

    const imagesToCreate = images && images.length > 0
      ? images.map((img, idx) => ({
          url: img.url,
          caption: img.caption || (img.isFloorPlan ? 'Floor Plan Layout' : 'Exterior Render'),
          isFloorPlan: !!img.isFloorPlan,
          sortOrder: img.sortOrder ?? idx,
        }))
      : [
          {
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            caption: 'Front Exterior Render',
            isFloorPlan: false,
            sortOrder: 0,
          },
          {
            url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
            caption: 'Floor Plan Preview',
            isFloorPlan: true,
            sortOrder: 1,
          },
        ];

    const plan = await prisma.plan.create({
      data: {
        ...planData,
        images: {
          create: imagesToCreate,
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ success: true, message: 'Plan created successfully', data: plan }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create plan', message: err?.message }, { status: 500 });
  }
}
