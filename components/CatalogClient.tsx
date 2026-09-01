'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Compass, SlidersHorizontal, ArrowUpDown, ArrowRight, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface PlanImage {
  id: string;
  url: string;
  isFloorPlan: boolean;
}

interface Plan {
  id: string;
  title: string;
  slug: string;
  description: string;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  stories: number;
  widthM: number;
  depthM: number;
  style: string;
  foundationType: string;
  price: number;
  images: PlanImage[];
}

export default function CatalogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minSqm, setMinSqm] = useState(searchParams.get('minSqm') || '50');
  const [maxSqm, setMaxSqm] = useState(searchParams.get('maxSqm') || '500');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '0');
  const [bathrooms, setBathrooms] = useState(searchParams.get('bathrooms') || '0');
  const [style, setStyle] = useState(searchParams.get('style') || 'ALL');
  const [foundationType, setFoundationType] = useState(searchParams.get('foundationType') || 'ALL');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchPlans = async () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (minSqm) query.set('minSqm', minSqm);
    if (maxSqm) query.set('maxSqm', maxSqm);
    if (bedrooms && bedrooms !== '0') query.set('bedrooms', bedrooms);
    if (bathrooms && bathrooms !== '0') query.set('bathrooms', bathrooms);
    if (style && style !== 'ALL') query.set('style', style);
    if (foundationType && foundationType !== 'ALL') query.set('foundationType', foundationType);
    if (sortBy) query.set('sortBy', sortBy);

    try {
      const res = await fetch(`/api/catalog?${query.toString()}`);
      const json = await res.json();
      if (json.success) {
        setPlans(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [search, minSqm, maxSqm, bedrooms, bathrooms, style, foundationType, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setMinSqm('50');
    setMaxSqm('500');
    setBedrooms('0');
    setBathrooms('0');
    setStyle('ALL');
    setFoundationType('ALL');
    setSortBy('newest');
  };

  return (
    <div className="space-y-8">
      {/* Search Header Bar */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder={t('catalog.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <SlidersHorizontal className="w-4 h-4 text-white" />
            {t('catalog.showing')} <strong className="text-white">{plans.length}</strong> {t('catalog.stockPlans')}
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-zinc-500"
            >
              <option value="newest">{t('catalog.sortNewest')}</option>
              <option value="price-asc">{t('catalog.sortPriceAsc')}</option>
              <option value="price-desc">{t('catalog.sortPriceDesc')}</option>
              <option value="sqm-asc">{t('catalog.sortSqmAsc')}</option>
              <option value="sqm-desc">{t('catalog.sortSqmDesc')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-white" />
                {t('catalog.filters')}
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] text-zinc-300 hover:text-white flex items-center gap-1 font-mono hover:underline"
              >
                <RefreshCw className="w-3 h-3" /> {t('catalog.reset')}
              </button>
            </div>

            {/* Square Meters Range Controls */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-zinc-300">
                <span>{t('catalog.squareMeters')}</span>
                <span className="font-mono text-white">{minSqm} - {maxSqm} m²</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400">{t('catalog.minSqm')}</label>
                  <input
                    type="number"
                    value={minSqm}
                    onChange={(e) => setMinSqm(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400">{t('catalog.maxSqm')}</label>
                  <input
                    type="number"
                    value={maxSqm}
                    onChange={(e) => setMaxSqm(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Bedrooms Count */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 block">{t('catalog.bedrooms')}</label>
              <div className="grid grid-cols-5 gap-1 text-xs">
                {['0', '1', '2', '3', '4+'].map((val, idx) => (
                  <button
                    key={val}
                    onClick={() => setBedrooms(idx === 4 ? '4' : val)}
                    className={`py-1.5 rounded-lg border font-mono font-bold transition-all ${
                      (bedrooms === val || (idx === 4 && bedrooms === '4'))
                        ? 'bg-white text-black border-white'
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {val === '0' ? t('catalog.any') : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Architectural Style */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 block">{t('catalog.style')}</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-zinc-500"
              >
                <option value="ALL">{t('catalog.allStyles')}</option>
                <option value="Farmhouse">{t('nav.farmhouse')}</option>
                <option value="Craftsman">{t('nav.craftsman')}</option>
                <option value="Modern">{t('nav.modern')}</option>
                <option value="Contemporary">Contemporary</option>
              </select>
            </div>

            {/* Foundation Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 block">{t('catalog.foundation')}</label>
              <select
                value={foundationType}
                onChange={(e) => setFoundationType(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-zinc-500"
              >
                <option value="ALL">{t('catalog.allFoundations')}</option>
                <option value="Slab">{t('catalog.slab')}</option>
                <option value="Crawlspace">{t('catalog.crawlspace')}</option>
                <option value="Basement">{t('catalog.basement')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Listing */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="glass-card p-12 text-center text-zinc-400 font-mono space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-white" />
              <p>Searching database index...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="glass-card p-12 text-center space-y-4">
              <Compass className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">{t('catalog.noPlansFound')}</h3>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto">
                {t('catalog.noPlansDesc')}
              </p>
              <button onClick={resetFilters} className="btn-secondary text-xs">
                {t('catalog.resetAllFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className="glass-card overflow-hidden group flex flex-col justify-between">
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
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
                    <div className="absolute top-3 left-3 bg-black/90 backdrop-blur-md px-3 py-1 rounded-lg border border-zinc-800 text-xs font-semibold text-zinc-200">
                      {plan.style}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white text-black font-black px-3 py-1 rounded-lg text-sm shadow-md">
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

                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 font-mono">
                      <div><span className="text-zinc-500">{t('catalog.sqmBadge')}:</span> <strong className="text-white">{plan.sqm} m²</strong></div>
                      <div><span className="text-zinc-500">{t('catalog.bedsBadge')}:</span> <strong className="text-white">{plan.bedrooms}</strong></div>
                      <div><span className="text-zinc-500">{t('catalog.bathsBadge')}:</span> <strong className="text-white">{plan.bathrooms}</strong></div>
                      <div><span className="text-zinc-500">{t('catalog.foundationBadge')}:</span> <strong className="text-white">{plan.foundationType}</strong></div>
                      <div><span className="text-zinc-500">{t('catalog.dimensionsBadge')}:</span> <strong className="text-white">{plan.widthM}m x {plan.depthM}m</strong></div>
                      <div><span className="text-slate-500">{t('catalog.storiesBadge')}:</span> <strong className="text-white">{plan.stories} {t('catalog.storyUnit')}</strong></div>
                    </div>

                    <Link
                      href={`/plans/${plan.slug}`}
                      className="btn-secondary w-full text-center text-xs py-2.5 flex items-center justify-center gap-2"
                    >
                      {t('catalog.viewDetails')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
