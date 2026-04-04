"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import OrderFulfillmentTable from "@/features/merchant/components/OrderFulfillmentTable";
import { useMerchantOrders } from "@/features/merchant/hooks/useMerchantOrders";
import { useToastContext } from "@/components/providers/ToastProvider";
import BackButton from "@/components/layout/UX/BackButton";

export default function MerchantFulfillmentPage() {
  const { addToast } = useToastContext();
  const { orders, loading, error, changeStatus } = useMerchantOrders();

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await changeStatus(orderId, status);
      addToast("success", `Order status updated to ${status}`);
    } catch (err: any) {
      addToast("error", err.message || "Failed to update order status");
    }
  };

  const pendingCount = orders.filter((o: any) => o.status === "PROCESSING").length;
  const shippedCount = orders.filter((o: any) => o.status === "SHIPPED").length;

  return (
    <ProtectedRoute allowedRoles={["MERCHANT", "ADMIN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BackButton className="mb-8" label="Dashboard" />
        
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
