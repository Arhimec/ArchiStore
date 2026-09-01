import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { verifyAdminSessionToken } from '@/lib/auth';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (!sessionToken || !verifyAdminSessionToken(sessionToken)) {
    redirect('/admin/login');
  }

  let plansCount = 0;
  let ordersCount = 0;
  let completedOrders: any[] = [];
  let totalRevenue = 0;
  let auditLogsCount = 0;

  try {
    plansCount = await prisma.plan.count();
    ordersCount = await prisma.order.count();
    completedOrders = await prisma.order.findMany({ where: { status: 'COMPLETED' } });
    totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    auditLogsCount = await prisma.auditLog.count();
  } catch (err) {
    console.error('Database query error on AdminDashboardPage:', err);
  }

  return (
    <AdminDashboardClient
      metrics={{
        plansCount,
        ordersCount,
        completedOrdersCount: completedOrders.length,
        totalRevenue,
        auditLogsCount,
      }}
    />
  );
}
