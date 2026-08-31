'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, ShieldCheck, CheckSquare, Square, ShoppingCart, Lock, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

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
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>CATALOG</span> / <span className="text-amber-400">{plan.style.toUpperCase()}</span> / <span className="text-white">{plan.title}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">{plan.title}</h1>
            <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
          </div>
          <div className="bg-slate-900 border border-amber-500/30 px-6 py-3 rounded-2xl text-right">
            <span className="block text-xs font-semibold text-slate-400 uppercase">Single-Build License Price</span>
            <span className="text-3xl font-black gold-gradient-text">${plan.price.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery & Dynamic Floor Plan Watermarking */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-4 space-y-4">
            {/* Gallery Tabs */}
            <div className="flex items-center gap-4 border-b border-slate-800 pb-3">
              <button
                onClick={() => { setActiveTab('renders'); setActiveImageIndex(0); }}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'renders'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
                }`}
              >
                3D Renderings & Exterior ({renders.length})
              </button>
              <button
                onClick={() => { setActiveTab('floorplans'); setActiveImageIndex(0); }}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'floorplans'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
                }`}
              >
                Watermarked Floor Plans ({floorPlans.length})
              </button>
            </div>

            {/* Main Preview Frame */}
            <div className="relative aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
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
                <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono">
                  No image preview available
                </div>
              )}

              {(currentImage?.isFloorPlan || activeTab === 'floorplans') && (
                <div className="absolute top-3 right-3 bg-red-950/90 border border-red-500/40 text-red-300 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  DYNAMIC SHARP WATERMARK ACTIVE
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
                      activeImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'
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
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Download Sample Plan PDF
              </span>
              <h4 className="text-sm font-bold text-white">Preview 1-Page Watermarked Construction Schematic</h4>
              <p className="text-slate-400 text-xs">Examine spatial layout quality and schematic detail prior to checkout.</p>
            </div>

            <a
              href={`/api/sample-pdf/${plan.id}`}
              download={`${plan.slug}-sample-plan.pdf`}
              className="btn-secondary text-xs px-4 py-2.5 whitespace-nowrap flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              Download Sample PDF
            </a>
          </div>

          {/* Technical Specifications Table */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Technical Specifications & Building Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">TOTAL HEATED AREA</span>
                <strong className="text-white text-sm">{plan.sqm} SQ M</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">DIMENSIONS</span>
                <strong className="text-white text-sm">{plan.widthM}m W x {plan.depthM}m D</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">BEDROOMS / BATHS</span>
                <strong className="text-white text-sm">{plan.bedrooms} Beds / {plan.bathrooms} Baths</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">FOUNDATION TYPE</span>
                <strong className="text-white text-sm">{plan.foundationType}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">CEILING HEIGHTS</span>
                <strong className="text-slate-200 text-xs">{plan.ceilingHeight}</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">ROOF PITCH & STYLE</span>
                <strong className="text-slate-200 text-xs">{plan.roofPitch}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Required Legal Checkbox & Checkout Action Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card-accent p-6 space-y-6 sticky top-24">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-500" />
                Purchase Construction PDF Package
              </h3>
              <p className="text-slate-400 text-xs mt-1">Instant digital delivery upon Stripe Checkout completion.</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Customer Contact Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Your Full Name <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Delivery Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="architect@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Your 72-hour signed PDF download link will be delivered here.
                  </span>
                </div>
              </div>

              {/* MANDATORY LEGAL DISCLAIMER CHECKBOX */}
              <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    id="legal-disclaimer-checkbox"
                    onClick={() => setDisclaimerChecked(!disclaimerChecked)}
                    className="mt-0.5 text-amber-400 hover:text-amber-300 focus:outline-none flex-shrink-0"
                  >
                    {disclaimerChecked ? (
                      <CheckSquare className="w-5 h-5 text-amber-400 fill-amber-500/20" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500" />
                    )}
                  </button>
                  <label
                    htmlFor="legal-disclaimer-checkbox"
                    onClick={() => setDisclaimerChecked(!disclaimerChecked)}
                    className="text-xs text-slate-300 leading-relaxed cursor-pointer select-none"
                  >
                    I acknowledge that I am purchasing a single-build license. I understand these plans are conceptual and must be reviewed and stamped by a local licensed structural engineer to meet regional building codes before construction.
                  </label>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* ADD TO CART / BUY NOW BUTTON (DISABLED UNTIL CHECKBOX CHECKED) */}
              <button
                type="submit"
                disabled={!disclaimerChecked || isSubmitting}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Preparing Secure Stripe Checkout...'
                ) : disclaimerChecked ? (
                  <>
                    <Lock className="w-4 h-4 text-slate-950" />
                    Buy Now • ${plan.price.toLocaleString()}
                  </>
                ) : (
                  'Check License Disclaimer to Buy'
                )}
              </button>

              {/* Guarantees */}
              <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant 72-Hour Tokenized Digital Vault Download</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Full High-Resolution Vector Blueprints Package</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Cryptographically Signed Stripe Webhook Listener</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
