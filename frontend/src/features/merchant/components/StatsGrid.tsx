'use client';

import { MerchantStats } from '@/lib/api/merchant';
import React from 'react';
import StatCard from './StatCard';

interface StatsGridProps {
  stats?: MerchantStats;
  loading: boolean;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, loading }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(val).replace('BDT', '৳');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Revenue - Featured Bento Card */}
      <div className="md:col-span-2 lg:col-span-2">
        <StatCard
          title="Total Revenue"
          value={loading ? 0 : formatCurrency(stats?.totalRevenue || 0)}
          description="Net sales performance across all products and categories."
          loading={loading}
          trend={{ value: 12.5, isUp: true }}
          className="bg-neutral-50/50 border-neutral-200"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v1m0-8v1m4 2h1m-10 0H5" />
            </svg>
          }
        />
      </div>

      {/* Total Sales */}
      <StatCard
        title="Total Sales"
        value={loading ? 0 : (stats?.totalSales || 0).toLocaleString()}
        description="Total orders processed safely."
        loading={loading}
        trend={{ value: 8.2, isUp: true }}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4l1-12z" />
          </svg>
        }
      />

      {/* Fulfillment Rate */}
      <StatCard
        title="Fulfillment Rate"
        value={loading ? '0%' : `${stats?.fulfillmentRate || 0}%`}
        description="Successful shipment completion."
        loading={loading}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      {/* Low Stock Alert */}
      <StatCard
        title="Low Stock Alert"
        value={loading ? 0 : stats?.lowStockProducts || 0}
        description="Products needing immediate restock."
        loading={loading}
        className={!loading && (stats?.lowStockProducts || 0) > 0 ? "border-amber-200 bg-amber-50/30" : ""}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      />
    </div>
  );
};

export default StatsGrid;
