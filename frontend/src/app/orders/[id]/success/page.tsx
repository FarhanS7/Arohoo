'use client';

import OrderSuccessDetails from '@/features/orders/components/OrderSuccessDetails';
import { getOrderById } from '@/lib/api/orders';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import PageLayout from '@/components/layout/UX/PageLayout';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const OrderSuccessPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: order, isLoading, isError, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
    retry: 0,
  });

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="h-12 w-12 border-4 border-neutral-100 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-neutral-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Syncing your order details...</p>
        </div>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-100">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-black text-neutral-900 mb-4 uppercase italic tracking-tighter">Something went wrong</h1>
            <p className="text-neutral-500 mb-10 font-medium italic">
              {error instanceof Error ? error.message : "We couldn't find your order details. Please check the ID or try again later."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-4 border-2 border-black rounded-2xl text-xs font-black uppercase tracking-widest text-black hover:bg-neutral-50 transition-all active:scale-95"
              >
                Try Again
              </button>
              <Link
                href="/products"
                className="px-8 py-4 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200 active:scale-95"
              >
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!order) return null;

  return (
    <PageLayout>
      <div className="bg-surface min-h-screen pt-12">
        <OrderSuccessDetails order={order} />
      </div>
    </PageLayout>
  );
};

export default OrderSuccessPage;
