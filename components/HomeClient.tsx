'use client';

import Link from 'next/link';
import { Compass, ArrowRight, ShieldCheck, FileCheck, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface PlanImage {
  url: string;
}

interface Plan {
  id: string;
  title: string;
  slug: string;
  description: string;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  foundationType: string;
  style: string;
  price: number;
  images: PlanImage[];
}

export default function HomeClient({ featuredPlans }: { featuredPlans: Plan[] }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-12 sm:space-y-16 py-2 sm:py-4">
      {/* Hero Banner Section */}
      <section className="glass-card-accent p-5 sm:p-8 lg:p-14 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-slate-300/40 dark:bg-zinc-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold text-slate-800 dark:text-zinc-200">
            <Sparkles className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
            {t('hero.badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t('hero.title1')} <span className="mono-gradient-text">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-slate-600 dark:text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <Link href="/catalog" className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base px-6 sm:px-8 py-3.5 text-center">
              {t('hero.browseBtn')}
              <ArrowRight className="w-5 h-5 text-white dark:text-zinc-950" />
            </Link>
            <Link href="/catalog?style=Farmhouse" className="btn-secondary text-sm sm:text-base px-6 py-3.5 text-center">
              {t('hero.farmhouseBtn')}
            </Link>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 border-t border-slate-200 dark:border-zinc-700/80 pt-6 sm:pt-8 mt-6 sm:mt-8 text-slate-700 dark:text-zinc-300">
            <div>
              <span className="block text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">{t('hero.stat1Num')}</span>
              <span className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400">{t('hero.stat1Text')}</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">{t('hero.stat2Num')}</span>
              <span className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400">{t('hero.stat2Text')}</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">{t('hero.stat3Num')}</span>
              <span className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400">{t('hero.stat3Text')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stock Plans Section */}
      <section className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 dark:border-zinc-800 pb-4 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('featured.title')}</h2>
            <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-0.5">{t('featured.subtitle')}</p>
          </div>
          <Link href="/catalog" className="text-slate-900 dark:text-white hover:underline text-xs sm:text-sm font-semibold flex items-center gap-1">
            {t('featured.viewAll')} ({featuredPlans.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featuredPlans.map((plan) => (
            <div key={plan.id} className="glass-card overflow-hidden group flex flex-col justify-between">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-zinc-900">
                {plan.images?.[0] ? (
                  <img
                    src={plan.images[0].url}
                    alt={plan.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-zinc-600">
                    <Compass className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-900 dark:text-zinc-200">
                  {plan.style}
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900 dark:bg-white text-white dark:text-zinc-950 font-black px-3 py-1 rounded-lg text-xs sm:text-sm shadow-md">
                  ${plan.price.toLocaleString()}
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-zinc-300 transition-colors">
                    {plan.title}
                  </h3>
                  <p className="text-slate-600 dark:text-zinc-400 text-xs line-clamp-2 mt-1">
                    {plan.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-900/80 p-3 rounded-xl border border-slate-200 dark:border-zinc-700/70 font-mono">
                  <div><span className="text-slate-500 dark:text-zinc-500">{t('catalog.sqmBadge')}:</span> <strong className="text-slate-900 dark:text-white">{plan.sqm} m²</strong></div>
                  <div><span className="text-slate-500 dark:text-zinc-500">{t('catalog.bedsBadge')}:</span> <strong className="text-slate-900 dark:text-white">{plan.bedrooms}</strong></div>
                  <div><span className="text-slate-500 dark:text-zinc-500">{t('catalog.bathsBadge')}:</span> <strong className="text-slate-900 dark:text-white">{plan.bathrooms}</strong></div>
                  <div><span className="text-slate-500 dark:text-zinc-500">{t('catalog.foundationBadge')}:</span> <strong className="text-slate-900 dark:text-white">{plan.foundationType}</strong></div>
                </div>

                <Link
                  href={`/plans/${plan.slug}`}
                  className="btn-secondary w-full text-center text-xs py-2.5 flex items-center justify-center gap-2"
                >
                  {t('featured.inspectSpecs')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Single-Build License & Engineer Review Callout */}
      <section className="glass-card-accent p-5 sm:p-8 lg:p-10 border-l-4 border-l-slate-900 dark:border-l-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            {t('callout.badge')}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{t('callout.title')}</h3>
          <p className="text-slate-600 dark:text-zinc-300 text-xs leading-relaxed">
            {t('callout.desc')}
          </p>
        </div>
        <Link href="/catalog" className="btn-primary text-xs w-full sm:w-auto text-center px-6 py-3 shrink-0">
          {t('callout.btn')}
        </Link>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        <div className="glass-card p-5 sm:p-6 space-y-3">
          <FileCheck className="w-7 h-7 sm:w-8 sm:h-8 text-slate-900 dark:text-white" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('features.feat1Title')}</h4>
          <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed">
            {t('features.feat1Desc')}
          </p>
        </div>
        <div className="glass-card p-5 sm:p-6 space-y-3">
          <Layers className="w-7 h-7 sm:w-8 sm:h-8 text-slate-900 dark:text-white" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('features.feat2Title')}</h4>
          <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed">
            {t('features.feat2Desc')}
          </p>
        </div>
        <div className="glass-card p-5 sm:p-6 space-y-3">
          <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-slate-900 dark:text-white" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">{t('features.feat3Title')}</h4>
          <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed">
            {t('features.feat3Desc')}
          </p>
        </div>
      </section>
    </div>
  );
}
