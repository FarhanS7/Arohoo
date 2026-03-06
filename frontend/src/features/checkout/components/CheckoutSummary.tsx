'use client';

import Image from 'next/image';
import React from 'react';

interface SummaryItem {
  productVariantId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
  variantName?: string;
  merchantName?: string;
}

interface CheckoutSummaryProps {
  items: SummaryItem[];
  total: number;
  isLoading?: boolean;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ items, total, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-neutral-100 animate-pulse">
        <div className="h-6 w-32 bg-neutral-100 rounded mb-6" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-16 w-16 bg-neutral-100 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 bg-neutral-100 rounded" />
                <div className="h-4 w-1/4 bg-neutral-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
      <h2 className="text-xl font-semibold mb-6 text-neutral-900">Order Summary</h2>
      
      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.productVariantId} className="flex gap-4 items-start">
            <div className="relative h-16 w-16 rounded-lg bg-neutral-50 overflow-hidden flex-shrink-0 border border-neutral-100">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-neutral-900 truncate">{item.name}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {item.variantName || 'Standard Variant'} • Qty: {item.quantity}
              </p>
              <p className="text-sm font-semibold text-neutral-900 mt-1">
                ৳{item.price.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-neutral-900">
                ৳{item.subtotal.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-100 space-y-3">
        <div className="flex justify-between text-base text-neutral-600">
          <span>Subtotal</span>
          <span>৳{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-base text-neutral-600">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">Free (Promotional)</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-neutral-900 pt-2">
          <span>Total</span>
          <span>৳{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-neutral-50 rounded-xl flex gap-3 text-xs text-neutral-500 border border-neutral-100">
        <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 20c.968.231 1.98.351 3 .351 3.17 0 6.066-1.247 8.209-3.272J" />
        </svg>
        <p>Your transaction is encrypted and secured by our advanced payment processing system.</p>
      </div>
    </div>
  );
};

export default CheckoutSummary;
