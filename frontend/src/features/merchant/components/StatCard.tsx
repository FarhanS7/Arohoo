'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className = '', 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className={cn("bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm flex flex-col justify-between h-full", className)}>
        <div>
          <Skeleton className="h-12 w-12 rounded-2xl mb-6" />
          <Skeleton className="h-4 w-24 rounded-full mb-2" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
        <Skeleton className="mt-6 h-4 w-40 rounded-full" />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm flex flex-col justify-between h-full ${className}`}>
      <div>
        <div className="flex items-start justify-between mb-8">
          <div className="p-4 rounded-2xl bg-neutral-50 text-neutral-900 shadow-sm border border-neutral-100">
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${trend.isUp ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
              {trend.isUp ? '↑' : '↓'} {trend.value}%
            </div>
          )}
        </div>
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-3xl font-extrabold text-neutral-900 tracking-tight">{value}</p>
      </div>
      {description && (
        <p className="mt-8 text-sm text-neutral-500 font-medium">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatCard;
