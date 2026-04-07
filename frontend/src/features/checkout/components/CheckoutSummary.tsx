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
  const tax = subtotal * 0.08; // Estimated 8% tax
  const total = subtotal + shippingCost + tax;
  
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest p-10 rounded-xl shadow-[0px_20px_40px_rgba(74,68,85,0.06)] animate-pulse font-body space-y-8">
        <div className="h-6 w-32 bg-surface-container-high rounded" />
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-24 w-20 bg-surface-container-low rounded-lg" />
              <div className="flex-1 space-y-3 py-1">
                <div className="h-4 w-2/3 bg-surface-container-high rounded" />
                <div className="h-3 w-1/3 bg-surface-container-high rounded" />
                <div className="h-5 w-1/4 bg-surface-container-low rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-body text-on-surface">
      <div className="bg-surface-container-lowest p-10 rounded-xl shadow-[0px_20px_40px_rgba(74,68,85,0.06)]">
        <h3 className="text-xl font-bold font-headline mb-8 text-on-surface">Order Summary</h3>
        
        <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item) => (
            <div key={item.productVariantId} className="flex items-start gap-4">
              <div className="w-20 h-24 bg-surface-container-low rounded-lg flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant opacity-50">
                    <span className="material-symbols-outlined text-3xl">imagesmode</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-on-surface max-w-[180px] truncate" title={item.name}>{item.name}</p>
                <p className="text-xs text-on-surface-variant mb-2">
                  {item.variantName ? `${item.variantName} | Qty: ${item.quantity}` : `Qty: ${item.quantity}`}
                </p>
                <p className="font-headline font-bold text-primary">
                  ৳{item.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-surface-container-high pt-8 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Subtotal</span>
            <span className="font-medium text-on-surface">৳{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Estimated Shipping</span>
            <span className="font-medium text-on-surface">৳{shippingCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Tax (8% Est.)</span>
            <span className="font-medium text-on-surface">৳{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex justify-between pt-4 border-t border-surface-container-high mt-4">
            <span className="text-lg font-bold font-headline text-on-surface">Total</span>
            <span className="text-lg font-bold font-headline text-primary">
              ৳{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <button 
          onClick={() => {
            const btn = document.getElementById('checkout-submit-btn');
            if (btn) btn.click();
          }}
          disabled={isLoading || items.length === 0}
          className="w-full mt-10 bg-primary text-white py-5 rounded-xl font-bold tracking-wide text-sm shadow-xl hover:bg-primary-hover hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          PLACE ORDER
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">lock</span>
          <span>SSL Encrypted Secure Payment (COD Proxy)</span>
        </div>
      </div>

      {/* Merchant Trust Card */}
      <div className="bg-primary/5 p-6 rounded-xl flex items-start gap-4 border border-primary/10">
        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-secondary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
        </div>
        <div>
          <p className="text-sm font-bold text-on-secondary-container">Ethereal Guarantee</p>
          <p className="text-xs text-on-secondary-container/80 leading-relaxed mt-1">
            Shop with peace of mind. Every purchase is protected by our zero-liability secure checkout and editorial return policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
