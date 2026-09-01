import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { verifyAdminSessionToken } from '@/lib/auth';
import AdminPlansClient from '@/components/AdminPlansClient';

export const revalidate = 0;

export default async function AdminPlansPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (!sessionToken || !verifyAdminSessionToken(sessionToken)) {
    redirect('/admin/login');
  }

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
