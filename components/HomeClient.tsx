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
    <div className="space-y-16 py-4">
      {/* Hero Banner Section */}
      <section className="glass-card-accent p-8 lg:p-14 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-zinc-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-200">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            {t('hero.badge')}
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {t('hero.title1')} <span className="mono-gradient-text">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-zinc-300 text-base lg:text-lg leading-relaxed">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/catalog" className="btn-primary flex items-center gap-2 text-base px-8 py-3.5">
              {t('hero.browseBtn')}
              <ArrowRight className="w-5 h-5 text-zinc-950" />
            </Link>
            <Link href="/catalog?style=Farmhouse" className="btn-secondary text-base px-6 py-3.5">
              {t('hero.farmhouseBtn')}
            </Link>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-3 gap-6 border-t border-zinc-700/80 pt-8 mt-8 text-zinc-300">
            <div>
              <span className="block text-2xl lg:text-3xl font-extrabold text-white">{t('hero.stat1Num')}</span>
              <span className="text-xs text-zinc-400">{t('hero.stat1Text')}</span>
            </div>
            <div>
              <span className="block text-2xl lg:text-3xl font-extrabold text-white">{t('hero.stat2Num')}</span>
              <span className="text-xs text-zinc-400">{t('hero.stat2Text')}</span>
            </div>
            <div>
              <span className="block text-2xl lg:text-3xl font-extrabold text-white">{t('hero.stat3Num')}</span>
              <span className="text-xs text-zinc-400">{t('hero.stat3Text')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stock Plans Section */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{t('featured.title')}</h2>
            <p className="text-zinc-400 text-sm mt-1">{t('featured.subtitle')}</p>
          </div>
          <Link href="/catalog" className="text-white hover:text-zinc-300 text-sm font-semibold flex items-center gap-1">
            {t('featured.viewAll')} ({featuredPlans.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPlans.map((plan) => (
            <div key={plan.id} className="glass-card overflow-hidden group flex flex-col justify-between">
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                {plan.images?.[0] ? (
                  <img
                    src={plan.images[0].url}
                    alt={plan.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <Compass className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-lg border border-zinc-700 text-xs font-semibold text-zinc-200">
                  {plan.style}
                </div>
                <div className="absolute bottom-3 right-3 bg-white text-zinc-950 font-black px-3 py-1 rounded-lg text-sm shadow-md">
                  ${plan.price.toLocaleString()}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-zinc-300 transition-colors">
                    {plan.title}
                  </h3>
                  <p className="text-zinc-400 text-xs line-clamp-2 mt-1">
                    {plan.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 bg-zinc-900/80 p-3 rounded-xl border border-zinc-700/70 font-mono">
                  <div><span className="text-zinc-500">{t('catalog.sqmBadge')}:</span> <strong className="text-white">{plan.sqm} m²</strong></div>
                  <div><span className="text-zinc-500">{t('catalog.bedsBadge')}:</span> <strong className="text-white">{plan.bedrooms}</strong></div>
                  <div><span className="text-zinc-500">{t('catalog.bathsBadge')}:</span> <strong className="text-white">{plan.bathrooms}</strong></div>
                  <div><span className="text-zinc-500">{t('catalog.foundationBadge')}:</span> <strong className="text-white">{plan.foundationType}</strong></div>
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
      <section className="glass-card-accent p-8 lg:p-10 border-l-4 border-l-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
            {t('callout.badge')}
          </div>
          <h3 className="text-xl font-bold text-white">{t('callout.title')}</h3>
          <p className="text-zinc-300 text-xs leading-relaxed">
            {t('callout.desc')}
          </p>
        </div>
        <Link href="/catalog" className="btn-primary text-xs whitespace-nowrap px-6 py-3">
          {t('callout.btn')}
        </Link>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 space-y-3">
          <FileCheck className="w-8 h-8 text-white" />
          <h4 className="text-base font-bold text-white">{t('features.feat1Title')}</h4>
          <p className="text-zinc-400 text-xs leading-relaxed">
            {t('features.feat1Desc')}
          </p>
        </div>
        <div className="glass-card p-6 space-y-3">
          <Layers className="w-8 h-8 text-white" />
          <h4 className="text-base font-bold text-white">{t('features.feat2Title')}</h4>
          <p className="text-zinc-400 text-xs leading-relaxed">
            {t('features.feat2Desc')}
          </p>
        </div>
        <div className="glass-card p-6 space-y-3">
          <CheckCircle2 className="w-8 h-8 text-white" />
          <h4 className="text-base font-bold text-white">{t('features.feat3Title')}</h4>
          <p className="text-zinc-400 text-xs leading-relaxed">
            {t('features.feat3Desc')}
          </p>
        </div>
      </section>
    </div>
  );
}
