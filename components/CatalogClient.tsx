'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Compass, SlidersHorizontal, ArrowUpDown, ArrowRight, RefreshCw } from 'lucide-react';

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
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  stories: number;
  widthFt: number;
  depthFt: number;
  style: string;
  foundationType: string;
  price: number;
  images: PlanImage[];
}

export default function CatalogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minSqft, setMinSqft] = useState(searchParams.get('minSqft') || '1000');
  const [maxSqft, setMaxSqft] = useState(searchParams.get('maxSqft') || '5000');
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
    if (minSqft) query.set('minSqft', minSqft);
    if (maxSqft) query.set('maxSqft', maxSqft);
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
  }, [search, minSqft, maxSqft, bedrooms, bathrooms, style, foundationType, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setMinSqft('1000');
    setMaxSqft('5000');
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
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by keyword, style, or feature..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            Showing <strong className="text-white">{plans.length}</strong> Stock Plans
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="newest">Sort by: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="sqft-asc">Sq Ft: Small to Large</option>
              <option value="sqft-desc">Sq Ft: Large to Small</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-500" />
                Multi-Faceted Filters
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-mono"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Square Footage Range Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Square Footage</span>
                <span className="font-mono text-amber-400">{minSqft} - {maxSqft} sqft</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">Min Sq Ft</label>
                  <input
                    type="number"
                    value={minSqft}
                    onChange={(e) => setMinSqft(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Max Sq Ft</label>
                  <input
                    type="number"
                    value={maxSqft}
                    onChange={(e) => setMaxSqft(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Bedrooms Count */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Bedrooms Count</label>
              <div className="grid grid-cols-5 gap-1 text-xs">
                {['0', '1', '2', '3', '4+'].map((val, idx) => (
                  <button
                    key={val}
                    onClick={() => setBedrooms(idx === 4 ? '4' : val)}
                    className={`py-1.5 rounded-lg border font-mono font-bold transition-all ${
                      (bedrooms === val || (idx === 4 && bedrooms === '4'))
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {val === '0' ? 'Any' : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Architectural Style */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Architectural Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
              >
                <option value="ALL">All Styles</option>
                <option value="Farmhouse">Modern Farmhouse</option>
                <option value="Craftsman">Luxury Craftsman</option>
                <option value="Modern">Minimalist Modern</option>
                <option value="Contemporary">Contemporary</option>
              </select>
            </div>

            {/* Foundation Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Foundation Type</label>
              <select
                value={foundationType}
                onChange={(e) => setFoundationType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500"
              >
                <option value="ALL">All Foundations</option>
                <option value="Slab">Monolithic Slab</option>
                <option value="Crawlspace">Vented Crawlspace</option>
                <option value="Basement">Full Daylight Basement</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Listing */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="glass-card p-12 text-center text-slate-400 font-mono space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500" />
              <p>Searching database index...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="glass-card p-12 text-center space-y-4">
              <Compass className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Architectural Plans Found</h3>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                No stock plans matched your filter criteria. Try adjusting the square footage range or selecting 'All Styles'.
              </p>
              <button onClick={resetFilters} className="btn-secondary text-xs">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className="glass-card overflow-hidden group flex flex-col justify-between">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    {plan.images?.[0] ? (
                      <img
                        src={plan.images[0].url}
                        alt={plan.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Compass className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-xs font-semibold text-amber-400">
                      {plan.style}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-lg text-sm shadow-md">
                      ${plan.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        {plan.title}
                      </h3>
                      <p className="text-slate-400 text-xs line-clamp-2 mt-1">
                        {plan.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 font-mono">
                      <div><span className="text-slate-500">SQ FT:</span> <strong className="text-white">{plan.sqft}</strong></div>
                      <div><span className="text-slate-500">BEDS:</span> <strong className="text-white">{plan.bedrooms}</strong></div>
                      <div><span className="text-slate-500">BATHS:</span> <strong className="text-white">{plan.bathrooms}</strong></div>
                      <div><span className="text-slate-500">FOUNDATION:</span> <strong className="text-white">{plan.foundationType}</strong></div>
                      <div><span className="text-slate-500">DIMENSIONS:</span> <strong className="text-white">{plan.widthFt}' x {plan.depthFt}'</strong></div>
                      <div><span className="text-slate-500">STORIES:</span> <strong className="text-white">{plan.stories} Story</strong></div>
                    </div>

                    <Link
                      href={`/plans/${plan.slug}`}
                      className="btn-secondary w-full text-center text-xs py-2.5 flex items-center justify-center gap-2"
                    >
                      View Plan Details & Watermarked Previews
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
