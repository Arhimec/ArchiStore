import { prisma } from '@/lib/prisma';
import AdminPlansClient from '@/components/AdminPlansClient';

export const revalidate = 0;

export default async function AdminPlansPage() {
  let plans: any[] = [];
  try {
    plans = await prisma.plan.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: true, orderItems: true },
    });
  } catch (err) {
    console.error('Database query error on AdminPlansPage:', err);
  }

  return <AdminPlansClient plans={plans} />;
}
