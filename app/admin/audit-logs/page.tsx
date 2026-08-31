import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, DownloadCloud } from 'lucide-react';

export const revalidate = 0;

export default async function AdminAuditLogsPage() {
  let auditLogs: any[] = [];
  try {
    auditLogs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      include: {
        token: {
          include: { order: true },
        },
      },
      take: 50,
    });
  } catch (err) {
    console.error('Database query error on AdminAuditLogsPage:', err);
  }

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-1 border-b border-slate-800 pb-6">
        <Link href="/admin" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono">
          <ArrowLeft className="w-3 h-3" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-white">Download Security Audit Trail Logs</h1>
        <p className="text-slate-400 text-xs">Real-time inspection of IP addresses, download attempts, user-agent details, and security enforcement events.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300">RECENT LOG EVENTS: {auditLogs.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Associated Order & Customer</th>
                <th className="p-4">User-Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50">
                  <td className="p-4 text-[11px] text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {log.action === 'DOWNLOAD_SUCCESS' ? (
                      <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                        DOWNLOAD SUCCESS
                      </span>
                    ) : log.action === 'EXPIRED_ATTEMPT' ? (
                      <span className="text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30 text-[10px]">
                        EXPIRED LINK REJECTED
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 text-[10px]">
                        MAX DOWNLOADS REJECTED
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-bold text-white">
                    {log.ipAddress}
                  </td>

                  <td className="p-4 text-slate-300">
                    {log.token?.order?.customerEmail || 'Anonymous Request'}
                  </td>

                  <td className="p-4 text-[10px] text-slate-500 max-w-xs truncate">
                    {log.userAgent || 'Unknown'}
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
