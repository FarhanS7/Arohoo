'use client';

import { Order } from '@/lib/api/orders';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface OrderSuccessDetailsProps {
  order: Order;
}

const OrderSuccessDetails: React.FC<OrderSuccessDetailsProps> = ({ order }) => {
  const shippingAddress = typeof order.shippingAddress === 'string' 
    ? order.shippingAddress 
    : JSON.stringify(order.shippingAddress);

  return (
    <div className="font-body text-on-surface w-full max-w-7xl mx-auto px-4 py-16 relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-container/20 blur-[120px] rounded-full pointer-events-none -z-10 -translate-x-1/4 translate-y-1/4" />

      <header className="mb-16 text-center lg:text-left max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-bold text-xs uppercase tracking-widest mb-6">
          <span className="material-symbols-outlined text-sm">verified</span>
          Transaction Successful
        </div>
        <h1 className="text-5xl lg:text-7xl font-extrabold font-headline tracking-tighter text-on-surface mb-4">
          Order Acquired.
        </h1>
        <p className="text-xl text-on-surface-variant font-light">
          Your curation has been confirmed. Order <span className="font-bold text-on-surface">#{order.id}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-8 rounded-2xl border border-white/40 shadow-sm relative overflow-hidden">
             <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -z-10" />
             <h3 className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-6">Delivery Target</h3>
             <p className="text-xl font-headline font-bold text-on-surface mb-2">{order.shippingName}</p>
             <p className="text-sm text-on-surface-variant mb-4">{order.shippingPhone}</p>
             <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
               {shippingAddress}
             </p>
             <div className="pt-4 border-t border-surface-container-high/50 flex justify-between items-center">
               <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Method</span>
               <span className="text-sm font-medium text-on-surface bg-surface-container py-1 px-3 rounded-md">Cash on Delivery</span>
             </div>
          </div>

          <div className="bg-primary text-white p-8 rounded-2xl relative overflow-hidden">
             <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] pointer-events-none" />
             <h3 className="text-xs uppercase tracking-widest font-bold opacity-70 mb-4">Status Update</h3>
             <p className="text-2xl font-headline font-bold mb-2">Preparing Shipment</p>
             <p className="text-sm opacity-80 mb-6">Our network of merchants is packaging your order.</p>
             
             <div className="flex justify-between text-xs font-bold uppercase tracking-widest border-t border-white/20 pt-4">
               <span>Total Billed</span>
               <span className="text-base">৳{Number(order.totalAmount).toLocaleString()}</span>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-8 rounded-2xl border border-white/40 shadow-sm h-full">
            <h3 className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-8 flex items-center justify-between">
              Manifest
              <span className="bg-surface-container-high text-on-surface py-1 px-3 rounded-full">{order.orderItems?.length || 0} Items</span>
            </h3>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {(order.orderItems || []).map((item) => (
                <div key={item.id} className="flex gap-6 items-center p-4 rounded-xl hover:bg-surface-container-lowest transition-colors border border-transparent hover:border-surface-container-high group">
                  <div className="w-24 h-32 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 relative group-hover:shadow-md transition-all">
                    {item.product.images?.[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant opacity-30">
                        <span className="material-symbols-outlined">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                      {(item.product as any).merchant?.storeName || 'Ethereal Collection'}
                    </p>
                    <h4 className="text-lg font-bold font-headline text-on-surface mb-1">{item.product.name}</h4>
                    <p className="text-sm text-on-surface-variant mb-3">
                      {[
                        item.productVariant.size ? `Size: ${item.productVariant.size}` : null,
                        item.productVariant.color ? `Color: ${item.productVariant.color}` : null
                      ].filter(Boolean).join(' • ')}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-on-surface-variant">Qty: {item.quantity}</span>
                      <span className="text-lg font-bold text-on-surface">৳{Number(item.price).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-surface-container-high/50 flex flex-col sm:flex-row justify-end gap-4">
              <Link 
                href="/products" 
                className="px-8 py-4 bg-primary text-white rounded-xl font-bold tracking-widest text-sm hover:bg-primary-hover transition-all active:scale-95 text-center flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">storefront</span>
                Return to Directory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessDetails;
