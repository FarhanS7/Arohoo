"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import OrderFulfillmentTable from "@/features/merchant/components/OrderFulfillmentTable";
import { useMerchantOrders } from "@/features/merchant/hooks/useMerchantOrders";
import { useState } from "react";

export default function MerchantFulfillmentPage() {
  const { orders, loading, error, changeStatus } = useMerchantOrders();
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await changeStatus(orderId, status);
      setSuccessInfo(`Order status updated to ${status}`);
      setTimeout(() => setSuccessInfo(null), 3000);
    } catch (err: any) {
      alert(err);
    }
  };

  const pendingCount = orders.filter(o => o.status === "PROCESSING").length;
  const shippedCount = orders.filter(o => o.status === "SHIPPED").length;

  return (
    <ProtectedRoute allowedRoles={["MERCHANT", "ADMIN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-neutral-100 pb-12">
          <div>
            <nav className="flex mb-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] gap-3">
              <span>Merchant Portal</span>
              <span className="text-neutral-200">/</span>
              <span className="text-blackCondensed">Fulfillment</span>
            </nav>
            <h1 className="text-5xl font-black text-neutral-900 tracking-tighter uppercase italic overflow-hidden">
               <span className="block animate-in slide-in-from-bottom-full duration-700">Fulfillment Center</span>
            </h1>
            <p className="mt-4 text-lg text-neutral-500 font-medium max-w-xl">
              Process incoming requests, manage shipments, and ensure quality delivery across your global catalog.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-neutral-50 p-10 rounded-[2.5rem] border border-neutral-100 group hover:border-black transition-all">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Requests</h3>
            <p className="text-4xl font-black text-neutral-900 leading-none">{orders.length}</p>
          </div>
          <div className="bg-amber-50 p-10 rounded-[2.5rem] border border-amber-100">
            <h3 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Processing Now</h3>
            <p className="text-4xl font-black text-amber-600 leading-none">{pendingCount}</p>
          </div>
          <div className="bg-black p-10 rounded-[2.5rem] border border-neutral-900 shadow-2xl shadow-neutral-300">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">In Transit</h3>
            <p className="text-4xl font-black text-white leading-none">{shippedCount}</p>
          </div>
        </div>

        {successInfo && (
          <div className="mb-8 bg-green-50 border border-green-100 text-green-700 px-8 py-5 rounded-[2rem] text-sm font-black flex items-center gap-4 animate-in fade-in slide-in-from-top-6 duration-500 shadow-lg shadow-green-50">
            <div className="flex h-8 w-8 bg-green-100 rounded-full items-center justify-center text-xs">✓</div>
            {successInfo}
          </div>
        )}

        {/* Main Table */}
        <div className="space-y-6">
          <OrderFulfillmentTable 
            orders={orders}
            onStatusChange={handleStatusChange}
            loading={loading}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
