import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, ShoppingBag, ShieldCheck, FileCheck2, LayoutDashboard } from 'lucide-react';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArchiStore | Premium Architectural Stock Plans & Blueprints',
  description: 'Instant download high-resolution CAD and PDF architectural stock plans, floor plans, and construction blueprints stamped for single-build licenses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between">
        {/* Navigation Header */}
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

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <Link href="/catalog" className="hover:text-amber-400 transition-colors">
                Browse Stock Plans
              </Link>
              <Link href="/catalog?style=Farmhouse" className="hover:text-amber-400 transition-colors">
                Modern Farmhouse
              </Link>
              <Link href="/catalog?style=Craftsman" className="hover:text-amber-400 transition-colors">
                Luxury Craftsman
              </Link>
              <Link href="/catalog?style=Modern" className="hover:text-amber-400 transition-colors">
                Minimalist Modern
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg hover:border-slate-700 transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500" />
                Admin Panel
              </Link>
              <Link href="/catalog" className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
                <ShoppingBag className="w-4 h-4" />
                Explore Plans
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-12 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-950 border-t border-slate-800/80 mt-16 px-4 lg:px-12 py-12 text-slate-400 text-sm">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-500" />
                <span className="text-lg font-bold text-white tracking-tight">ARCHISTORE</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                ArchiStore is the premier digital marketplace for high-performance architectural stock plans. All blueprint packages include structural dimension sheets, roof pitch profiles, floor plans, and electrical layouts ready for local engineering review.
              </p>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Stripe Encrypted Checkout
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <FileCheck2 className="w-4 h-4 text-amber-400" />
                  Single-Build Copyright License
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Architectural Styles</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/catalog?style=Farmhouse" className="hover:text-amber-400">Modern Farmhouse</Link></li>
                <li><Link href="/catalog?style=Craftsman" className="hover:text-amber-400">Luxury Craftsman</Link></li>
                <li><Link href="/catalog?style=Modern" className="hover:text-amber-400">Minimalist Contemporary</Link></li>
                <li><Link href="/catalog?foundationType=Basement" className="hover:text-amber-400">Daylight Basement Plans</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal & Support</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/admin" className="hover:text-amber-400">Admin Dashboard</Link></li>
                <li><span className="text-slate-500">Engineering Review Terms</span></li>
                <li><span className="text-slate-500">Single-Build License FAQs</span></li>
                <li><span className="text-slate-500">Cloud R2 Digital Vault Security</span></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto border-t border-slate-800/60 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} ArchiStore Inc. All pre-drawn architectural plans are protected under international copyright laws.</p>
            <p>Built with Next.js, Prisma, Stripe & Sharp Watermark Engine.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
