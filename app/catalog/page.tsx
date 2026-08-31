import { Suspense } from 'react';
import CatalogClient from '@/components/CatalogClient';

export const revalidate = 0;

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-slate-400 font-mono">
        Loading Architectural Catalog...
      </div>
    }>
      <CatalogClient />
    </Suspense>
  );
}
