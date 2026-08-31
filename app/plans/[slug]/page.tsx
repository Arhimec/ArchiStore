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

  const plan = await prisma.plan.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!plan) {
    notFound();
  }

  return <PlanDetailClient plan={plan} />;
}
