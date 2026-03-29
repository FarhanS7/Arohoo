'use client';

import { Order } from '@/lib/api/orders';
import Link from 'next/link';
import React from 'react';

interface OrderHistoryTableProps {
  orders: Order[];
  isLoading: boolean;
}

const OrderHistoryTable: React.FC<OrderHistoryTableProps> = ({ orders, isLoading }) => {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
        <div className="animate-pulse">
          <div className="h-16 bg-neutral-50 border-b border-neutral-100" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 border-b border-neutral-50 flex items-center px-6 gap-4">
              <div className="h-4 w-24 bg-neutral-100 rounded" />
              <div className="h-4 w-32 bg-neutral-100 rounded" />
              <div className="h-4 w-20 bg-neutral-100 rounded ml-auto" />
              <div className="h-6 w-24 bg-neutral-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-neutral-300 py-20 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-neutral-50 mb-6">
          <svg className="h-8 w-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 12H4l1-12z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-neutral-900">No orders yet</h3>
        <p className="mt-2 text-neutral-500 max-w-xs mx-auto">
          When you place an order, it will appear here. Start shopping our premium collection today!
        </p>
        <Link 
          href="/products" 
          className="mt-8 inline-flex items-center px-6 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-neutral-800 transition-all"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-100">
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-neutral-900">#{order.id.slice(0, 8)}...</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-neutral-600">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-sm font-bold text-neutral-900">
                    ৳{Number(order.totalAmount).toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)} uppercase tracking-tight`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <Link 
                    href={`/orders/${order.id}/success`}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1 opacity-0 group-hover:opacity-100"
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistoryTable;
