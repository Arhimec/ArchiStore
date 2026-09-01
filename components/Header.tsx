'use client';

import Link from 'next/link';
import { Compass, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 px-4 lg:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-950 shadow-md group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              ARCHI<span className="mono-gradient-text font-black">STORE</span>
            </span>
            <span className="block text-[10px] text-zinc-400 font-mono tracking-wider uppercase -mt-1">
              Architectural Stock Plans
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <Link href="/catalog" className="hover:text-white transition-colors">
            {t('nav.browsePlans')}
          </Link>
          <Link href="/catalog?style=Farmhouse" className="hover:text-white transition-colors">
            {t('nav.farmhouse')}
          </Link>
          <Link href="/catalog?style=Craftsman" className="hover:text-white transition-colors">
            {t('nav.craftsman')}
          </Link>
          <Link href="/catalog?style=Modern" className="hover:text-white transition-colors">
            {t('nav.modern')}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 border border-zinc-700 px-3.5 py-2 rounded-lg hover:border-zinc-600 transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-zinc-300" />
            {t('nav.adminPanel')}
          </Link>
          <Link href="/catalog" className="btn-primary flex items-center gap-2 text-sm py-2.5 px-4 sm:px-5">
            <ShoppingBag className="w-4 h-4 text-zinc-950" />
            <span className="hidden sm:inline">{t('nav.explorePlans')}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
