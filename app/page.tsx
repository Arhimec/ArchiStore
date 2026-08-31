import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Compass, ArrowRight, ShieldCheck, FileCheck, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  let featuredPlans: any[] = [];
  try {
    featuredPlans = await prisma.plan.findMany({
      where: { isPublished: true, featured: true },
      take: 3,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
  } catch (err) {
    console.error('Database query error on HomePage:', err);
  }

  return (
    <div className="space-y-16 py-4">
      {/* Hero Banner Section */}
      <section className="glass-card-accent p-8 lg:p-14 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            Ready-to-Build Architectural Stock Blueprints
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Build Your Vision With <span className="gold-gradient-text">Architectural Precision</span>
          </h1>
          <p className="text-slate-300 text-base lg:text-lg leading-relaxed">
            Browse our curated library of pre-drawn architectural stock plans. Instantly download full high-res construction PDF packages featuring structural wall layouts, ceiling heights, roof pitch specifications, and electrical schematics.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/catalog" className="btn-primary flex items-center gap-2 text-base px-8 py-3.5">
              Browse Stock Plan Catalog
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/catalog?style=Farmhouse" className="btn-secondary text-base px-6 py-3.5">
              Modern Farmhouses
            </Link>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-3 gap-6 border-t border-slate-800/80 pt-8 mt-8 text-slate-300">
            <div>
              <span className="block text-2xl lg:text-3xl font-extrabold text-white">100%</span>
              <span className="text-xs text-slate-400">Digital PDF Packages</span>
            </div>
            <div>
              <span className="block text-2xl lg:text-3xl font-extrabold text-amber-400">72-Hour</span>
              <span className="text-xs text-slate-400">Secure Download Token Access</span>
            </div>
            <div>
              <span className="block text-2xl lg:text-3xl font-extrabold text-white">Instant</span>
              <span className="text-xs text-slate-400">Stripe Checkout Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stock Plans Section */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Featured Architectural Plans</h2>
            <p className="text-slate-400 text-sm mt-1">High-performance stock blueprints ready for engineering review</p>
          </div>
          <Link href="/catalog" className="text-amber-400 hover:text-amber-300 text-sm font-semibold flex items-center gap-1">
            View All Plans ({featuredPlans.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPlans.map((plan) => (
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
                </div>

                <Link
                  href={`/plans/${plan.slug}`}
                  className="btn-secondary w-full text-center text-xs py-2.5 flex items-center justify-center gap-2"
                >
                  Inspect Plan Specs & Previews
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Single-Build License & Engineer Review Callout */}
      <section className="glass-card-accent p-8 lg:p-10 border-l-4 border-l-amber-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            Engineering & Building Code Compliance Notice
          </div>
          <h3 className="text-xl font-bold text-white">Single-Build Copyright License Included</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            All stock plans sold on ArchiStore are conceptual architectural blueprint packages. Buyers receive a single-build license. Prior to construction, plans must be reviewed, localized, and stamped by a licensed structural engineer in your building jurisdiction.
          </p>
        </div>
        <Link href="/catalog" className="btn-primary text-xs whitespace-nowrap px-6 py-3">
          Explore Catalog With Watermarked Previews
        </Link>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 space-y-3">
          <FileCheck className="w-8 h-8 text-amber-400" />
          <h4 className="text-base font-bold text-white">Sharp Dynamic Floor Plan Watermarking</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Public preview floor plans rendered on site are dynamically overlaid with copyright watermark banners to protect intellectual property.
          </p>
        </div>
        <div className="glass-card p-6 space-y-3">
          <Layers className="w-8 h-8 text-emerald-400" />
          <h4 className="text-base font-bold text-white">Secure Encrypted Token Delivery</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Construction PDFs sit in non-public storage buckets. Downloads use 72-hour crypto signed URLs capped at 3 download attempts with audit logging.
          </p>
        </div>
        <div className="glass-card p-6 space-y-3">
          <CheckCircle2 className="w-8 h-8 text-blue-400" />
          <h4 className="text-base font-bold text-white">Stripe Webhook Cryptographic Verification</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Automated instant link generation triggers upon Stripe checkout completion with cryptographic signature verification.
          </p>
        </div>
      </section>
    </div>
  );
}
