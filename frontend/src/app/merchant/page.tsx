'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import StatsGrid from '@/features/merchant/components/StatsGrid';
import { getMerchantStats } from '@/lib/api/merchant';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

const MerchantDashboardPage = () => {
  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ['merchant-stats'],
    queryFn: getMerchantStats,
    retry: 1,
  });

  return (
    <ProtectedRoute allowedRoles={['MERCHANT', 'ADMIN']}>
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-100 pb-12">
            <div>
              <nav className="flex mb-6 text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] gap-3">
                <span className="hover:text-black cursor-pointer transition-colors">Merchant Portal</span>
                <span className="text-neutral-200">/</span>
                <span className="text-black">Dashboard</span>
              </nav>
              <h1 className="text-5xl font-black text-neutral-900 tracking-tighter sm:text-6xl">
                Store Overview
              </h1>
              <p className="mt-4 text-lg text-neutral-500 font-medium max-w-2xl">
                Monitor your business performance with real-time analytics and inventory health tracking.
              </p>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/merchant/products"
                className="inline-flex items-center px-8 py-4 bg-black text-white text-sm font-bold rounded-2xl hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200"
              >
                Manage Inventory
              </Link>
            </div>
          </header>

          {/* Error State */}
          {isError ? (
            <div data-testid="error-container" className="bg-red-50 border border-red-100 rounded-3xl p-12 text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100 text-red-600 mb-8 grayscale opacity-50">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Analytics unavailable</h3>
              <p className="mt-4 text-neutral-500 mb-10 max-w-md mx-auto">
                {error instanceof Error ? error.message : "We encountered a persistent issue while loading your store statistics. Please refresh the page."}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-10 py-4 border-2 border-black rounded-2xl text-sm font-bold text-black hover:bg-black hover:text-white transition-all duration-300"
              >
                Troubleshoot Connection
              </button>
            </div>
          ) : (
            <StatsGrid stats={stats} loading={isLoading} />
          )}

          {/* Quick Actions / Future Sections */}
          {!isLoading && !isError && (
            <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 rounded-[2.5rem] bg-neutral-900 text-white overflow-hidden relative group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Campaign Performance</h3>
                  <p className="text-neutral-400 text-sm mb-8 max-w-xs">Track how your latest marketing efforts are impacting sales.</p>
                  <button className="text-sm font-bold border-b-2 border-white pb-1 group-hover:pr-4 transition-all">View report →</button>
                </div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
              </div>
              <div className="p-10 rounded-[2.5rem] bg-indigo-600 text-white overflow-hidden relative group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Inventory Health</h3>
                  <p className="text-indigo-200 text-sm mb-8 max-w-xs">AI-powered insights on when to restock your best sellers.</p>
                  <button className="text-sm font-bold border-b-2 border-white pb-1 group-hover:pr-4 transition-all">Optimize stock →</button>
                </div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-black/20 rounded-full blur-3xl" />
              </div>
            </section>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MerchantDashboardPage;
