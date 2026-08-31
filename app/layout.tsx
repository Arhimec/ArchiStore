import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/i18n/context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
        <LanguageProvider>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-12 py-8">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
