'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ArrowRight, RefreshCw, KeyRound } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || json.message || 'Invalid admin password');
      }

      // Redirect to Admin Dashboard upon successful authentication
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid admin password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 space-y-8">
      <div className="glass-card-accent p-8 space-y-6 border-amber-500/40">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-md">
            <Lock className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{t('admin.loginTitle')}</h1>
          <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
            {t('admin.loginSubtitle')}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              {t('admin.passwordLabel')} <span className="text-amber-400">*</span>
            </label>
            <input
              type="password"
              required
              autoFocus
              placeholder={t('admin.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 font-bold"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                {t('admin.authenticating')}
              </>
            ) : (
              <>
                {t('admin.loginBtn')}
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-slate-800/80 pt-4 text-center text-[11px] text-slate-500 font-mono">
          <span>Cryptographically Secured PBKDF2 Database Authentication</span>
        </div>
      </div>
    </div>
  );
}
