import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FileSpreadsheet, Plus, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

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

  return (
    <div className="space-y-8 py-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <Link href="/admin" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono">
            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white">Architectural Stock Plan Catalog Management</h1>
          <p className="text-slate-400 text-xs">Manage active blueprint listings, specifications, and private PDF mappings.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300">TOTAL LISTINGS: {plans.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-4">Title & Slug</th>
                <th className="p-4">Specs (Sqm/Bed/Bath)</th>
                <th className="p-4">Style & Foundation</th>
                <th className="p-4">Price</th>
                <th className="p-4">Private PDF File</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-900/50">
                  <td className="p-4 font-semibold text-white">
                    <div>{plan.title}</div>
                    <div className="text-[10px] text-amber-400 font-mono">{plan.slug}</div>
                  </td>
                  <td className="p-4 font-mono">
                    {plan.sqm} m² | {plan.bedrooms}b/{plan.bathrooms}ba
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[11px] font-mono text-slate-200">
                      {plan.style} • {plan.foundationType}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-amber-400 font-mono">
                    ${plan.price.toLocaleString()}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-slate-400">
                    {plan.pdfFileName}
                  </td>
                  <td className="p-4">
                    {plan.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-semibold bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
