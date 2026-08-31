'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Download, ShieldCheck, Clock, FileCheck2, ArrowRight } from 'lucide-react';

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [downloadToken, setDownloadToken] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const processOrder = async () => {
      try {
        // Trigger mock webhook processing to finalize order & generate token if needed
        await fetch('/api/webhooks/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'stripe-signature': 'whsec_mock_secret',
          },
          body: JSON.stringify({
            type: 'checkout.session.completed',
            data: {
              object: {
                id: sessionId,
                customer_email: 'customer@example.com',
              },
            },
          }),
        });

        // Query admin orders endpoint or direct token status
        const res = await fetch(`/api/admin/orders`, {
          headers: { 'x-admin-passcode': 'admin1234' },
        });

        if (res.ok) {
          const data = await res.json();
          const match = data.data?.find((o: any) => o.stripeSessionId === sessionId || o.id === sessionId);
          if (match) {
            setOrderDetails(match);
            if (match.downloadTokens?.[0]?.token) {
              setDownloadToken(match.downloadTokens[0].token);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    processOrder();
  }, [sessionId]);

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const downloadUrl = downloadToken ? `${appUrl}/api/downloads/${downloadToken}` : null;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      {/* Top Banner */}
      <div className="glass-card-accent p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <h1 className="text-3xl font-extrabold text-white">Order Confirmed & Digital Assets Ready</h1>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">
          Thank you for your purchase. Your single-build architectural stock plan license is active, and your private construction PDF package has been generated.
        </p>

        {sessionId && (
          <div className="inline-block bg-slate-950 px-4 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
            SESSION ID: <span className="text-amber-400 font-bold">{sessionId}</span>
          </div>
        )}
      </div>

      {/* Immediate Download Token Box */}
      <div className="glass-card p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 font-bold text-white text-base">
            <FileCheck2 className="w-5 h-5 text-amber-500" />
            Your Time-Limited Secure Download Token
          </div>
          <span className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono px-3 py-1 rounded-full">
            Valid for 72 Hours • Max 3 Attempts
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 font-mono">
            Generating cryptographically signed URL...
          </div>
        ) : downloadUrl ? (
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-slate-500 block">SIGNED DIGITAL DOWNLOAD URL</span>
                <span className="text-xs font-mono text-slate-300 break-all">{downloadUrl}</span>
              </div>

              <a
                href={downloadUrl}
                download
                className="btn-primary py-3 px-6 text-sm flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Download className="w-4 h-4 text-slate-950" />
                Download Construction PDF Package
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Expiration: 72 hours from purchase timestamp</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Audit Trail Logging: IP & Download Count</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-300">
            Token is initializing. You can access your plan via the Admin Dashboard or contact support with your Session ID.
          </div>
        )}
      </div>

      {/* Return to Catalog button */}
      <div className="flex justify-center pt-4">
        <Link href="/catalog" className="btn-secondary text-sm px-6 py-3 flex items-center gap-2">
          Return to Architectural Stock Catalog
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
