import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { verifyAdminSessionToken } from '@/lib/auth';
import Link from 'next/link';
import AdminOrdersClient from '@/components/AdminOrdersClient';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (!sessionToken || !verifyAdminSessionToken(sessionToken)) {
    redirect('/admin/login');
  }

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { plan: true } },
        downloadTokens: { include: { auditLogs: true } },
      },
    });
  } catch (err) {
    console.error('Database query error on AdminOrdersPage:', err);
  }

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-1 border-b border-slate-800 pb-6">
        <Link href="/admin" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono">
          <ArrowLeft className="w-3 h-3" /> Înapoi la Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-white">Comenzi Clienți și Regenerare Token-uri</h1>
        <p className="text-slate-400 text-xs">Inspectează achizițiile, verifică numărul de descărcări și emite link-uri noi valabile 72 de ore pentru clienți confirmați.</p>
      </div>

      <AdminOrdersClient initialOrders={orders} />
    </div>
  );
}
