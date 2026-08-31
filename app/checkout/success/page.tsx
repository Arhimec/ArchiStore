import { Suspense } from 'react';
import OrderSuccessClient from '@/components/OrderSuccessClient';

export const revalidate = 0;

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-slate-400 font-mono">
        Verifying Stripe Checkout Session & Generating Download Token...
      </div>
    }>
      <OrderSuccessClient />
    </Suspense>
  );
}
