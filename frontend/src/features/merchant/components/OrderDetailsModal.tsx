"use client";

import { Order } from "@/lib/api/orders";
import { X, User, Phone, MapPin, Package, Clock } from "lucide-react";
import Image from "next/image";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const shippingAddress = typeof order.shippingAddress === 'string' 
    ? order.shippingAddress 
    : JSON.stringify(order.shippingAddress, null, 2);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        {/* Header */}
        <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Order Details</span>
              <div className="w-1 h-1 rounded-full bg-neutral-300" />
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tighter uppercase italic">
              Order #{order.id.slice(-8).toUpperCase()}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 sm:p-3 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-900"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 sm:py-10 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12">
            {/* Left: Customer & Shipping */}
            <div className="space-y-10">
              <section>
                <div className="flex items-center gap-2 mb-4 sm:mb-6 text-neutral-900">
                  <User className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-widest italic">Customer Profile</h3>
                </div>
                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Name</label>
                      <p className="text-sm font-bold text-neutral-900">{order.shippingName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Phone</label>
                        <p className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                          <Phone className="w-3 h-3 text-indigo-500" />
                          {order.shippingPhone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4 sm:mb-6 text-neutral-900">
                  <MapPin className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-widest italic">Shipping Destination</h3>
                </div>
                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
                  <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Address Details</label>
                  <p className="text-sm font-bold text-neutral-900 leading-relaxed">
                    {shippingAddress}
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4 sm:mb-6 text-neutral-900">
                  <Clock className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-widest italic">Fulfillment Progress</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                   {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"].map((s) => (
                     <div 
                        key={s} 
                        className={`px-3 py-1.5 rounded-full text-[8px] font-black tracking-widest border transition-all ${
                          order.status.toUpperCase() === s 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 scale-105' 
                          : 'bg-white text-neutral-300 border-neutral-100 opacity-60'
                        }`}
                     >
                       {s}
                     </div>
                   ))}
                </div>
              </section>
            </div>

            {/* Right: Order Items Manifest */}
            <div className="lg:border-l lg:border-neutral-100 lg:pl-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-neutral-900">
                  <Package className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-widest italic">Order Manifest</h3>
                </div>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest bg-neutral-50 px-3 py-1 rounded-full">
                  {order.orderItems?.length || 0} Items
                </span>
              </div>

              <div className="space-y-6">
                {(order.orderItems || []).map((item) => (
                  <div key={item.id} className="flex gap-4 items-start p-4 hover:bg-neutral-50 rounded-2xl transition-colors group">
                    <div className="relative w-16 h-16 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0 border border-neutral-200/50">
                      {item.product?.images?.[0]?.url && (
                        <Image 
                          src={item.product.images[0].url} 
                          alt={item.product.name} 
                          fill 
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-neutral-900 line-clamp-1 uppercase tracking-tight mb-1">{item.product?.name || "Unknown Product"}</h4>
                      <p className="text-[10px] font-bold text-neutral-400 mb-2">
                        {item.productVariant?.size && `Size: ${item.productVariant.size}`}
                        {item.productVariant?.size && item.productVariant?.color && " • "}
                        {item.productVariant?.color && `Color: ${item.productVariant.color}`}
                      </p>
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-neutral-400">Qty: {item.quantity}</span>
                        <span className="text-sm font-black text-neutral-900">৳{Number(item.price).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-neutral-100 flex justify-between items-center bg-white sticky bottom-0">
                <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Total Valuation</span>
                <span className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tighter italic">৳{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 sm:px-10 py-6 sm:py-8 border-t border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-8 py-3 text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:text-neutral-900 transition-colors text-center"
          >
            Close Viewer
          </button>
          <button 
             onClick={() => window.print()}
             className="px-8 py-3 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-neutral-200"
          >
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
