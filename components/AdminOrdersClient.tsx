'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle2, Copy, ShieldAlert, FileCheck2, Clock } from 'lucide-react';

export default function AdminOrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleRegenerate = async (orderId: string, planId: string) => {
    setRegeneratingId(orderId);
    setMessage('');

    try {
      const res = await fetch('/api/admin/token-regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': 'admin1234',
        },
        body: JSON.stringify({ orderId, planId }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || 'Regeneration failed');
      }

      setMessage(`Fresh 72-hour token issued for Order #${orderId.substring(0, 8)}`);

      // Refetch orders list
      const fetchRes = await fetch('/api/admin/orders', {
        headers: { 'x-admin-passcode': 'admin1234' },
      });
      if (fetchRes.ok) {
        const fetchJson = await fetchRes.json();
        setOrders(fetchJson.data);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setRegeneratingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-4 bg-amber-950/60 border border-amber-500/40 rounded-xl text-xs text-amber-300 font-mono">
          {message}
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Purchased Plan</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Download Token Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {orders.map((order) => {
                const item = order.items?.[0];
                const tokenObj = order.downloadTokens?.[0];
                const isExpired = tokenObj ? new Date() > new Date(tokenObj.expiresAt) : false;
                const isMaxedOut = tokenObj ? tokenObj.downloadCount >= tokenObj.maxDownloads : false;

                return (
                  <tr key={order.id} className="hover:bg-slate-900/50">
                    <td className="p-4 font-mono">
                      <div className="font-bold text-white">#{order.id.substring(0, 8)}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{order.customerEmail}</div>
                      {order.customerName && <div className="text-[10px] text-slate-400">{order.customerName}</div>}
                    </td>

                    <td className="p-4 font-mono text-amber-400 font-semibold">
                      {item?.plan?.title || 'Architectural Plan Set'}
                    </td>

                    <td className="p-4 font-mono font-bold text-emerald-400">
                      ${order.totalAmount.toLocaleString()}
                    </td>

                    <td className="p-4 font-mono">
                      {tokenObj ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-200">
                              Downloads: <strong className="text-white">{tokenObj.downloadCount} / {tokenObj.maxDownloads}</strong>
                            </span>
                          </div>
                          {isExpired ? (
                            <span className="text-[10px] text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">EXPIRED</span>
                          ) : isMaxedOut ? (
                            <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">MAX DOWNLOADS REACHED</span>
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">ACTIVE</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">No Token</span>
                      )}
                    </td>

                    <td className="p-4">
                      {item?.planId && (
                        <button
                          onClick={() => handleRegenerate(order.id, item.planId)}
                          disabled={regeneratingId === order.id}
                          className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5 text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                        >
                          <RefreshCw className={`w-3 h-3 ${regeneratingId === order.id ? 'animate-spin' : ''}`} />
                          Regenerate 72h Token
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
