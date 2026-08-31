'use client';

import Link from 'next/link';
import { Compass, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              ARCHI<span className="gold-gradient-text font-black">STORE</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase -mt-1">
              Architectural Stock Plans
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/catalog" className="hover:text-amber-400 transition-colors">
            {t('nav.browsePlans')}
          </Link>
          <Link href="/catalog?style=Farmhouse" className="hover:text-amber-400 transition-colors">
            {t('nav.farmhouse')}
          </Link>
          <Link href="/catalog?style=Craftsman" className="hover:text-amber-400 transition-colors">
            {t('nav.craftsman')}
          </Link>
          <Link href="/catalog?style=Modern" className="hover:text-amber-400 transition-colors">
            {t('nav.modern')}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg hover:border-slate-700 transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-amber-500" />
            {t('nav.adminPanel')}
          </Link>
          <Link href="/catalog" className="btn-primary flex items-center gap-2 text-sm py-2.5 px-4 sm:px-5">
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t('nav.explorePlans')}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
