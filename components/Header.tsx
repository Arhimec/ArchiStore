'use client';

import Link from 'next/link';
import { Compass, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white/90 border-b border-slate-200 dark:bg-zinc-900/90 dark:border-zinc-800 backdrop-blur-md px-3 sm:px-4 lg:px-12 py-3 sm:py-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 shadow-md group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              ARCHI<span className="mono-gradient-text font-black">STORE</span>
            </span>
            <span className="hidden sm:block text-[10px] text-slate-500 dark:text-zinc-400 font-mono tracking-wider uppercase -mt-1">
              Architectural Stock Plans
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-zinc-300">
          <Link href="/catalog" className="hover:text-slate-950 dark:hover:text-white transition-colors">
            {t('nav.browsePlans')}
          </Link>
          <Link href="/catalog?style=Farmhouse" className="hover:text-slate-950 dark:hover:text-white transition-colors">
            {t('nav.farmhouse')}
          </Link>
          <Link href="/catalog?style=Craftsman" className="hover:text-slate-950 dark:hover:text-white transition-colors">
            {t('nav.craftsman')}
          </Link>
          <Link href="/catalog?style=Modern" className="hover:text-slate-950 dark:hover:text-white transition-colors">
            {t('nav.modern')}
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <ThemeSwitcher />
          <LanguageSwitcher />
          
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white bg-slate-100 border border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 px-3.5 py-2 rounded-lg hover:border-slate-400 dark:hover:border-zinc-600 transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
            {t('nav.adminPanel')}
          </Link>

          <Link href="/catalog" className="btn-primary flex items-center justify-center gap-2 text-sm p-2 sm:py-2.5 sm:px-5">
            <ShoppingBag className="w-4 h-4 text-white dark:text-zinc-950" />
            <span className="hidden sm:inline">{t('nav.explorePlans')}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
