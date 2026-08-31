import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { LayoutDashboard, FileSpreadsheet, ShoppingBag, ShieldAlert, ArrowRight, DollarSign, DownloadCloud } from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const plansCount = await prisma.plan.count();
  const ordersCount = await prisma.order.count();
  const completedOrders = await prisma.order.findMany({ where: { status: 'COMPLETED' } });
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const auditLogsCount = await prisma.auditLog.count();

  return (
    <div className="space-y-8 py-4">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase mb-1">
            <LayoutDashboard className="w-4 h-4" /> Role-Based Control Panel
          </div>
          <h1 className="text-3xl font-extrabold text-white">Administrative Management Dashboard</h1>
          <p className="text-slate-400 text-xs mt-1">Manage plan listings, customer orders, download link tokens & security audit logs.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/plans" className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-500" />
            Manage Plans
          </Link>
          <Link href="/admin/orders" className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            View Orders
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block uppercase">Total Revenue</span>
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <span className="text-3xl font-black text-white font-mono">${totalRevenue.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">From {completedOrders.length} completed purchases</span>
        </div>

        <div className="glass-card p-6 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block uppercase">Total Orders</span>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <span className="text-3xl font-black text-white font-mono">{ordersCount}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Active & completed checkouts</span>
        </div>

        <div className="glass-card p-6 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block uppercase">Stock Listings</span>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-400" />
            <span className="text-3xl font-black text-white font-mono">{plansCount}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Published blueprints</span>
        </div>

        <div className="glass-card p-6 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block uppercase">Download Audit Logs</span>
          <div className="flex items-center gap-2">
            <DownloadCloud className="w-6 h-6 text-purple-400" />
            <span className="text-3xl font-black text-white font-mono">{auditLogsCount}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Recorded access events</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/plans" className="glass-card p-6 hover:border-amber-500/50 transition-all group space-y-3">
          <FileSpreadsheet className="w-8 h-8 text-amber-400" />
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
            Plan Listings Management
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Create new plan listings, edit structural specifications, upload preview renders, or archive outdated catalog items.
          </p>
        </Link>

        <Link href="/admin/orders" className="glass-card p-6 hover:border-amber-500/50 transition-all group space-y-3">
          <ShoppingBag className="w-8 h-8 text-emerald-400" />
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
            Orders & Token Regeneration
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Inspect customer purchases, view download count status, and regenerate 72-hour tokenized URLs for verified clients.
          </p>
        </Link>

        <Link href="/admin/audit-logs" className="glass-card p-6 hover:border-amber-500/50 transition-all group space-y-3">
          <ShieldAlert className="w-8 h-8 text-purple-400" />
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
            Download Security Audit Logs
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            View real-time IP address logs, timestamps, user-agent details, and download attempt count enforcement records.
          </p>
        </Link>
      </div>
    </div>
  );
}
