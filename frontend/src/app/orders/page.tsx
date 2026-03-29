'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import OrderHistoryTable from '@/features/orders/components/OrderHistoryTable';
import { getMyOrders } from '@/lib/api/orders';
import { useQuery } from '@tanstack/react-query';

const OrderHistoryPage = () => {
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['my-orders'],
    queryFn: getMyOrders,
    retry: 1,
  });

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'MERCHANT', 'ADMIN']}>
      <div className="min-h-screen bg-neutral-50/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="flex mb-4 text-xs font-bold text-neutral-400 uppercase tracking-widest gap-2">
                <span>Account</span>
                <span>/</span>
                <span className="text-neutral-900">Orders</span>
              </nav>
              <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">Order History</h1>
              <p className="mt-2 text-neutral-500">Track and manage your premium footwear orders.</p>
            </div>
          </header>

          {isError ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Unable to load orders</h3>
              <p className="mt-2 text-neutral-500 mb-6">
                {error instanceof Error ? error.message : "We encountered an issue while fetching your order history. Please try again later."}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 border border-black rounded-full text-sm font-bold text-black hover:bg-neutral-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <OrderHistoryTable orders={orders || []} isLoading={isLoading} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrderHistoryPage;
