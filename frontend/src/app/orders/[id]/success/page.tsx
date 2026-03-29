'use client';

import OrderSuccessDetails from '@/features/orders/components/OrderSuccessDetails';
import { getOrderById } from '@/lib/api/orders';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const OrderSuccessPage = () => {
  const params = useParams();
  const id = params.id as string;

  const { data: order, isLoading, isError, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
    retry: 0, // Disable retries to make tests faster and more predictable
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-neutral-100 border-t-black rounded-full animate-spin" />
          <p className="text-neutral-500 font-medium animate-pulse">Syncing your order details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Something went wrong</h1>
          <p className="text-neutral-500 mb-8">
            {error instanceof Error ? error.message : "We couldn't find your order details. Please check the ID or try again later."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-8 py-3 border border-black rounded-full text-base font-bold text-black hover:bg-neutral-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-white">
      <OrderSuccessDetails order={order} />
    </div>
  );
};

export default OrderSuccessPage;
