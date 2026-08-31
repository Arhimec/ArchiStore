import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PlanDetailClient from '@/components/PlanDetailClient';

export const revalidate = 0;

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let plan = null;
  try {
    plan = await prisma.plan.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
  } catch (err) {
    console.error('Database query error on PlanDetailPage:', err);
  }

  if (!plan) {
    notFound();
  }

  return <PlanDetailClient plan={plan} />;
}
