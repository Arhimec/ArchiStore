'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

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
        },
        body: JSON.stringify({ orderId, planId }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || 'Regenerare eșuată');
      }

      setMessage(`Token nou valabil 72 ore emis pentru Comanda #${orderId.substring(0, 8)}`);

      // Refetch orders list
      const fetchRes = await fetch('/api/admin/orders');
      if (fetchRes.ok) {
        const fetchJson = await fetchRes.json();
        setOrders(fetchJson.data);
      }
    } catch (err: any) {
      setMessage(`Eroare: ${err.message}`);
    } finally {
      setRegeneratingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200 font-mono">
          {message}
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 text-zinc-400 font-mono border-b border-zinc-800 uppercase text-[10px]">
              <tr>
                <th className="p-4">ID Comandă & Dată</th>
                <th className="p-4">Client</th>
                <th className="p-4">Proiect Achiziționat</th>
                <th className="p-4">Sumă Totală</th>
                <th className="p-4">Status Token Descărcare</th>
                <th className="p-4">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              {orders.map((order) => {
                const item = order.items?.[0];
                const tokenObj = order.downloadTokens?.[0];
                const isExpired = tokenObj ? new Date() > new Date(tokenObj.expiresAt) : false;
                const isMaxedOut = tokenObj ? tokenObj.downloadCount >= tokenObj.maxDownloads : false;

                return (
                  <tr key={order.id} className="hover:bg-zinc-800/50">
                    <td className="p-4 font-mono">
                      <div className="font-bold text-white">#{order.id.substring(0, 8)}</div>
                      <div className="text-[10px] text-zinc-400">
                        {new Date(order.createdAt).toLocaleDateString('ro-RO')}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-zinc-200">{order.customerEmail}</div>
                      {order.customerName && <div className="text-[10px] text-zinc-400">{order.customerName}</div>}
                    </td>

                    <td className="p-4 font-mono text-white font-semibold">
                      {item?.plan?.title || 'Proiect Arhitectural'}
                    </td>

                    <td className="p-4 font-mono font-bold text-white">
                      ${order.totalAmount.toLocaleString()}
                    </td>

                    <td className="p-4 font-mono">
                      {tokenObj ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-zinc-200">
                              Descărcări: <strong className="text-white">{tokenObj.downloadCount} / {tokenObj.maxDownloads}</strong>
                            </span>
                          </div>
                          {isExpired ? (
                            <span className="text-[10px] text-red-300 font-bold bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40">EXPIRAT</span>
                          ) : isMaxedOut ? (
                            <span className="text-[10px] text-zinc-300 font-bold bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">NUMĂR MAXIM ATINS</span>
                          ) : (
                            <span className="text-[10px] text-white font-bold bg-zinc-800 px-2 py-0.5 rounded border border-zinc-600">ACTIV</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-500 text-[11px]">Fără Token</span>
                      )}
                    </td>

                    <td className="p-4">
                      {item?.planId && (
                        <button
                          onClick={() => handleRegenerate(order.id, item.planId)}
                          disabled={regeneratingId === order.id}
                          className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5 text-white border-zinc-700 hover:bg-zinc-700/50"
                        >
                          <RefreshCw className={`w-3 h-3 ${regeneratingId === order.id ? 'animate-spin' : ''}`} />
                          Regenerează Token 72h
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
