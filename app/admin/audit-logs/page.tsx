import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { verifyAdminSessionToken } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function AdminAuditLogsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (!sessionToken || !verifyAdminSessionToken(sessionToken)) {
    redirect('/admin/login');
  }

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
          <ArrowLeft className="w-3 h-3" /> Înapoi la Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-white">Jurnale de Securitate și Audit Descărcări</h1>
        <p className="text-slate-400 text-xs">Inspectare în timp real a adreselor IP, încercărilor de descărcare, detaliilor User-Agent și regulilor de securitate.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300">EVENIMENTE RECENTE ÎNREGISTRATE: {auditLogs.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-4">Data și Ora</th>
                <th className="p-4">Tip Eveniment</th>
                <th className="p-4">Adresă IP</th>
                <th className="p-4">Comandă și Client</th>
                <th className="p-4">User-Agent Browser</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50">
                  <td className="p-4 text-[11px] text-slate-400">
                    {new Date(log.timestamp).toLocaleString('ro-RO')}
                  </td>

                  <td className="p-4">
                    {log.action === 'DOWNLOAD_SUCCESS' ? (
                      <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                        DESCĂRCARE REUȘITĂ
                      </span>
                    ) : log.action === 'EXPIRED_ATTEMPT' ? (
                      <span className="text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30 text-[10px]">
                        LINK EXPIRAT RESPINS
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 text-[10px]">
                        NUMĂR MAXIM ATINS
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-bold text-white">
                    {log.ipAddress}
                  </td>

                  <td className="p-4 text-slate-300">
                    {log.token?.order?.customerEmail || 'Solicitare Anonimă'}
                  </td>

                  <td className="p-4 text-[10px] text-slate-500 max-w-xs truncate">
                    {log.userAgent || 'Necunoscut'}
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
