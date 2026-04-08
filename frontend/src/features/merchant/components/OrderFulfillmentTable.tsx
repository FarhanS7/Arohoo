"use client";

import { Order } from "@/lib/api/orders";
import { useState } from "react";

interface OrderFulfillmentTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: string) => Promise<any>;
  loading: boolean;
}

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderFulfillmentTable({ orders, onStatusChange, loading }: OrderFulfillmentTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await onStatusChange(orderId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-neutral-50 text-neutral-400 border-neutral-100";
      case "CONFIRMED":
      case "PROCESSING":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "SHIPPED":
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "DELIVERED":
        return "bg-green-50 text-green-600 border-green-100";
      default:
        return "bg-neutral-50 text-neutral-600 border-neutral-100";
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-24 bg-neutral-50 rounded-[2.5rem] border-2 border-dashed border-neutral-200">
        <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">No pending fulfillments</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-[2.5rem] shadow-xl shadow-neutral-100 border border-neutral-100">
      <table className="min-w-full divide-y divide-neutral-100">
        <thead className="bg-neutral-50/50">
          <tr>
            <th className="px-10 py-6 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Order & Customer</th>
            <th className="px-10 py-6 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Items Summary</th>
            <th className="px-10 py-6 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Revenue</th>
            <th className="px-10 py-6 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Status Control</th>
            <th className="px-10 py-6 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-neutral-50/30 transition-colors group">
              <td className="px-10 py-8 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-neutral-900 tracking-tighter">#{order.id.slice(-8).toUpperCase()}</span>
                  <span className="text-xs text-neutral-500 font-bold">{order.shippingName}</span>
                </div>
              </td>
              <td className="px-10 py-8">
                <div className="flex flex-col gap-1 max-w-[250px]">
                  {(order.orderItems || []).slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <span className="text-xs font-bold text-neutral-700 truncate flex-1">{item.product?.name || "Unknown Product"}</span>
                      <span className="text-[10px] font-black text-neutral-400">x{item.quantity}</span>
                    </div>
                  ))}
                  {(order.orderItems?.length || 0) > 2 && (
                    <span className="text-[10px] font-black text-indigo-500 uppercase mt-1">
                      + {(order.orderItems?.length || 0) - 2} more items
                    </span>
                  )}
                </div>
              </td>
              <td className="px-10 py-8 whitespace-nowrap">
                <span className="text-sm font-black text-neutral-900">৳{order.totalAmount.toLocaleString()}</span>
              </td>
              <td className="px-10 py-8 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusBadgeStyles(order.status)}`}>
                    {order.status}
                  </div>
                  <div className="h-4 w-px bg-neutral-100" />
                  <select
                    disabled={updatingId === order.id}
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="bg-transparent text-[10px] font-black text-neutral-900 uppercase tracking-widest cursor-pointer focus:outline-none hover:text-indigo-600 transition-colors disabled:opacity-30"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </td>
              <td className="px-10 py-8 whitespace-nowrap text-right">
                <span className="text-xs font-bold text-neutral-400 capitalize">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
