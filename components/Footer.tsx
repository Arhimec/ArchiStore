'use client';

import Link from 'next/link';
import { Compass, ShieldCheck, FileCheck2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-100 border-t border-slate-200 dark:bg-zinc-950 dark:border-zinc-800 mt-16 px-4 lg:px-12 py-12 text-slate-600 dark:text-zinc-400 text-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-slate-900 dark:text-white" />
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">ARCHISTORE</span>
          </div>
          <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed max-w-md">
            {t('footer.desc')}
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-slate-800 dark:text-zinc-200" />
              {t('footer.stripeEncrypted')}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300">
              <FileCheck2 className="w-4 h-4 text-slate-800 dark:text-zinc-200" />
              {t('footer.singleLicense')}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-4">{t('footer.colStyles')}</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/catalog?style=Farmhouse" className="hover:text-slate-950 dark:hover:text-white transition-colors">{t('nav.farmhouse')}</Link></li>
            <li><Link href="/catalog?style=Craftsman" className="hover:text-slate-950 dark:hover:text-white transition-colors">{t('nav.craftsman')}</Link></li>
            <li><Link href="/catalog?style=Modern" className="hover:text-slate-950 dark:hover:text-white transition-colors">{t('nav.modern')}</Link></li>
            <li><Link href="/catalog?foundationType=Basement" className="hover:text-slate-950 dark:hover:text-white transition-colors">{t('catalog.basement')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-4">{t('footer.colLegal')}</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/admin" className="hover:text-slate-950 dark:hover:text-white transition-colors">{t('nav.adminPanel')}</Link></li>
            <li><span className="text-slate-500 dark:text-zinc-500">{t('callout.badge')}</span></li>
            <li><span className="text-slate-500 dark:text-zinc-500">{t('callout.title')}</span></li>
            <li><span className="text-slate-500 dark:text-zinc-500">{t('pdp.guarantee1')}</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-zinc-800/80 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-zinc-500 gap-4">
        <p>© {new Date().getFullYear()} {t('footer.copyright')}</p>
        <p>{t('footer.techStack')}</p>
      </div>
    </footer>
  );
}
