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
  subtotal: number;
  shippingCost: number;
  isLoading?: boolean;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ items, subtotal, shippingCost, isLoading }) => {
  const total = subtotal + shippingCost;
  
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-neutral-100 animate-pulse font-sans">
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 font-sans">
      <h2 className="text-xl font-bold mb-6 text-neutral-900">Order Summary</h2>
      
      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.productVariantId} className="flex gap-4 items-start pb-4 border-b border-neutral-50 last:border-0 last:pb-0">
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
              <h3 className="text-sm font-semibold text-neutral-900 truncate">{item.name}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {item.variantName || 'Standard Variant'} • Qty: {item.quantity}
              </p>
              <p className="text-sm font-bold text-purple-600 mt-1">
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
          <span className="font-semibold text-neutral-900">৳{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-base text-neutral-600">
          <span>Shipping Cost</span>
          <span className="font-semibold text-neutral-900">
            {shippingCost > 0 ? `৳${shippingCost}` : 'Calculated next'}
          </span>
        </div>
        <div className="flex justify-between text-xl font-bold text-neutral-900 pt-4 border-t border-neutral-50 border-dashed">
          <span>Total Payable</span>
          <span className="text-purple-600">৳{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-xl flex gap-3 text-xs text-purple-700 border border-purple-100">
        <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p>Your order is secured by <b>Cash on Delivery</b>. Pay only when you receive your package.</p>
      </div>
    </div>
  );
};

export default CheckoutSummary;
