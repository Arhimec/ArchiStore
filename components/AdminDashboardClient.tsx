'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, FileSpreadsheet, ShoppingBag, ShieldAlert, ArrowRight, DollarSign, DownloadCloud, LogOut } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface AdminMetrics {
  plansCount: number;
  ordersCount: number;
  completedOrdersCount: number;
  totalRevenue: number;
  auditLogsCount: number;
}

export default function AdminDashboardClient({ metrics }: { metrics: AdminMetrics }) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase mb-1">
            <LayoutDashboard className="w-4 h-4" /> {t('admin.badge')}
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t('admin.title')}</h1>
          <p className="text-slate-400 text-xs mt-1">{t('admin.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/plans" className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-500" />
            {t('admin.managePlansBtn')}
          </Link>
          <Link href="/admin/orders" className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            {t('admin.viewOrdersBtn')}
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 hover:border-red-500/40 px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            {t('admin.logoutBtn')}
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block uppercase">{t('admin.totalRevenue')}</span>
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <span className="text-3xl font-black text-white font-mono">${metrics.totalRevenue.toLocaleString()}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">From {metrics.completedOrdersCount} {t('admin.totalRevenueDesc')}</span>
        </div>

        <div className="glass-card p-6 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block uppercase">{t('admin.totalOrders')}</span>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <span className="text-3xl font-black text-white font-mono">{metrics.ordersCount}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">{t('admin.totalOrdersDesc')}</span>
        </div>

        <div className="glass-card p-6 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block uppercase">{t('admin.stockListings')}</span>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-400" />
            <span className="text-3xl font-black text-white font-mono">{metrics.plansCount}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">{t('admin.stockListingsDesc')}</span>
        </div>

        <div className="glass-card p-6 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block uppercase">{t('admin.auditLogs')}</span>
          <div className="flex items-center gap-2">
            <DownloadCloud className="w-6 h-6 text-purple-400" />
            <span className="text-3xl font-black text-white font-mono">{metrics.auditLogsCount}</span>
          </div>
          <span className="text-[11px] text-slate-500 block">{t('admin.auditLogsDesc')}</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/plans" className="glass-card p-6 hover:border-amber-500/50 transition-all group space-y-3">
          <FileSpreadsheet className="w-8 h-8 text-amber-400" />
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
            {t('admin.plansMgmtTitle')}
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            {t('admin.plansMgmtDesc')}
          </p>
        </Link>

        <Link href="/admin/orders" className="glass-card p-6 hover:border-amber-500/50 transition-all group space-y-3">
          <ShoppingBag className="w-8 h-8 text-emerald-400" />
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
            {t('admin.ordersMgmtTitle')}
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            {t('admin.ordersMgmtDesc')}
          </p>
        </Link>

        <Link href="/admin/audit-logs" className="glass-card p-6 hover:border-amber-500/50 transition-all group space-y-3">
          <ShieldAlert className="w-8 h-8 text-purple-400" />
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
            {t('admin.auditMgmtTitle')}
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            {t('admin.auditMgmtDesc')}
          </p>
        </Link>
      </div>
    </div>
  );
}
