import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import AdminOrdersClient from '@/components/AdminOrdersClient';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function AdminOrdersPage() {
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
          <ArrowLeft className="w-3 h-3" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-white">Customer Orders & Token Regeneration</h1>
        <p className="text-slate-400 text-xs">Inspect purchase receipts, check download attempt counts, and issue fresh 72-hour download links.</p>
      </div>

      <AdminOrdersClient initialOrders={orders} />
    </div>
  );
}
