'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ShieldCheck, CheckSquare, Square, ShoppingCart, Lock, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface PlanImage {
  id: string;
  url: string;
  caption: string | null;
  isFloorPlan: boolean;
  sortOrder: number;
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
  garageSpaces: number;
  widthM: number;
  depthM: number;
  style: string;
  foundationType: string;
  ceilingHeight: string;
  roofPitch: string;
  price: number;
  images: PlanImage[];
}

export default function PlanDetailClient({ plan }: { plan: Plan }) {
  const router = useRouter();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'renders' | 'floorplans'>('renders');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const renders = plan.images.filter((img) => !img.isFloorPlan);
  const floorPlans = plan.images.filter((img) => img.isFloorPlan);

  const displayedImages = activeTab === 'renders' ? (renders.length > 0 ? renders : plan.images) : floorPlans;
  const currentImage = displayedImages[activeImageIndex] || plan.images[0];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disclaimerChecked) {
      setErrorMsg('You must check the legal engineering disclaimer before purchasing.');
      return;
    }
    if (!customerEmail || !customerEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address for delivery.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          licenseAgreed: true,
          customerEmail,
          customerName: customerName || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || 'Checkout initiation failed');
      }

      if (json.url) {
        router.push(json.url);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Top Header & Breadcrumb */}
      <div className="space-y-3 border-b border-slate-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-zinc-400">
          <span>{t('pdp.catalog')}</span> / <span className="text-slate-900 dark:text-white">{plan.style.toUpperCase()}</span> / <span className="text-slate-700 dark:text-zinc-200">{plan.title}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{plan.title}</h1>
            <p className="text-slate-600 dark:text-zinc-400 text-sm mt-1">{plan.description}</p>
          </div>
          <div className="bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 px-6 py-3 rounded-2xl text-right">
            <span className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">{t('pdp.licensePrice')}</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">${plan.price.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery & Dynamic Floor Plan Watermarking */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-4 space-y-4">
            {/* Gallery Tabs */}
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-zinc-800 pb-3">
              <button
                onClick={() => { setActiveTab('renders'); setActiveImageIndex(0); }}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'renders'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                    : 'text-slate-600 hover:text-slate-950 bg-slate-100 border border-slate-300 dark:text-zinc-400 dark:hover:text-white dark:bg-zinc-900 dark:border-zinc-700'
                }`}
              >
                {t('pdp.rendersTab')} ({renders.length})
              </button>
              <button
                onClick={() => { setActiveTab('floorplans'); setActiveImageIndex(0); }}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'floorplans'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                    : 'text-slate-600 hover:text-slate-950 bg-slate-100 border border-slate-300 dark:text-zinc-400 dark:hover:text-white dark:bg-zinc-900 dark:border-zinc-700'
                }`}
              >
                {t('pdp.floorplansTab')} ({floorPlans.length})
              </button>
            </div>

            {/* Main Preview Frame */}
            <div className="relative aspect-[16/10] bg-slate-100 dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800">
              {currentImage ? (
                <img
                  src={
                    currentImage.isFloorPlan || activeTab === 'floorplans'
                      ? `/api/watermark?src=${encodeURIComponent(currentImage.url)}`
                      : currentImage.url
                  }
                  alt={currentImage.caption || plan.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-zinc-600 font-mono">
                  No image preview available
                </div>
              )}

              {(currentImage?.isFloorPlan || activeTab === 'floorplans') && (
                <div className="absolute top-3 right-3 bg-slate-900/90 dark:bg-zinc-900/90 border border-slate-700 dark:border-zinc-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  {t('pdp.watermarkActive')}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {displayedImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {displayedImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border transition-all flex-shrink-0 ${
                      activeImageIndex === idx ? 'border-slate-900 dark:border-white ring-2 ring-slate-900/20 dark:ring-white/20' : 'border-slate-200 dark:border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Downloadable Sample Plan Bar */}
          <div className="glass-card-accent p-6 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-900 dark:text-white" /> {t('pdp.samplePdfTitle')}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t('pdp.samplePdfHeading')}</h4>
              <p className="text-slate-600 dark:text-zinc-400 text-xs">{t('pdp.samplePdfDesc')}</p>
            </div>

            <a
              href={`/api/sample-pdf/${plan.id}`}
              download={`${plan.slug}-sample-plan.pdf`}
              className="btn-secondary text-xs px-4 py-2.5 whitespace-nowrap flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-slate-900 dark:text-white" />
              {t('pdp.downloadSampleBtn')}
            </a>
          </div>

          {/* Technical Specifications Table */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-zinc-800 pb-3">
              {t('pdp.specsTitle')}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-500 dark:text-zinc-500 block">{t('pdp.totalArea')}</span>
                <strong className="text-slate-900 dark:text-white text-sm">{plan.sqm} SQ M</strong>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-500 dark:text-zinc-500 block">{t('pdp.dimensions')}</span>
                <strong className="text-slate-900 dark:text-white text-sm">{plan.widthM}m W x {plan.depthM}m D</strong>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-500 dark:text-zinc-500 block">{t('pdp.bedsBaths')}</span>
                <strong className="text-slate-900 dark:text-white text-sm">{plan.bedrooms} Beds / {plan.bathrooms} Baths</strong>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-500 dark:text-zinc-500 block">{t('pdp.foundationType')}</span>
                <strong className="text-slate-900 dark:text-white text-sm">{plan.foundationType}</strong>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-500 dark:text-zinc-500 block">{t('pdp.ceilingHeights')}</span>
                <strong className="text-slate-800 dark:text-zinc-200 text-xs">{plan.ceilingHeight}</strong>
              </div>
              <div className="bg-slate-50 dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-zinc-800">
                <span className="text-slate-500 dark:text-zinc-500 block">{t('pdp.roofPitch')}</span>
                <strong className="text-slate-800 dark:text-zinc-200 text-xs">{plan.roofPitch}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Required Legal Checkbox & Checkout Action Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card-accent p-6 space-y-6 sticky top-24">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-slate-900 dark:text-white" />
                {t('pdp.purchaseTitle')}
              </h3>
              <p className="text-slate-600 dark:text-zinc-400 text-xs mt-1">{t('pdp.purchaseDesc')}</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Customer Contact Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                    {t('pdp.nameLabel')} <span className="text-slate-500 dark:text-zinc-500">{t('pdp.optional')}</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 dark:bg-zinc-900 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1">
                    {t('pdp.emailLabel')} <span className="text-slate-900 dark:text-white">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="architect@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 dark:bg-zinc-900 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-slate-500 dark:focus:border-zinc-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 block">
                    {t('pdp.emailHelp')}
                  </span>
                </div>
              </div>

              {/* MANDATORY LEGAL DISCLAIMER CHECKBOX */}
              <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-700 space-y-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    id="legal-disclaimer-checkbox"
                    onClick={() => setDisclaimerChecked(!disclaimerChecked)}
                    className="mt-0.5 text-slate-900 dark:text-white focus:outline-none flex-shrink-0"
                  >
                    {disclaimerChecked ? (
                      <CheckSquare className="w-5 h-5 text-slate-900 dark:text-white fill-slate-900/10 dark:fill-white/20" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
                    )}
                  </button>
                  <label
                    htmlFor="legal-disclaimer-checkbox"
                    onClick={() => setDisclaimerChecked(!disclaimerChecked)}
                    className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed cursor-pointer select-none"
                  >
                    {t('pdp.disclaimerText')}
                  </label>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-100 border border-red-300 dark:bg-red-950/80 dark:border-red-500/50 rounded-xl text-red-800 dark:text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* ADD TO CART / BUY NOW BUTTON */}
              <button
                type="submit"
                disabled={!disclaimerChecked || isSubmitting}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  t('pdp.submitting')
                ) : disclaimerChecked ? (
                  <>
                    <Lock className="w-4 h-4 text-white dark:text-zinc-950" />
                    {t('pdp.buyNow')} • ${plan.price.toLocaleString()}
                  </>
                ) : (
                  t('pdp.checkToBuy')
                )}
              </button>

              {/* Guarantees */}
              <div className="space-y-2 border-t border-slate-200 dark:border-zinc-800 pt-4 text-xs text-slate-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-white" />
                  <span>{t('pdp.guarantee1')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-white" />
                  <span>{t('pdp.guarantee2')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-white" />
                  <span>{t('pdp.guarantee3')}</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
