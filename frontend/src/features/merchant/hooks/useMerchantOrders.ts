import { getMerchantOrders, updateOrderStatus } from "@/lib/api/merchant";
import { Order } from "@/lib/api/orders";
import { useCallback, useEffect, useState } from "react";

export function useMerchantOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMerchantOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const changeStatus = async (orderId: string, status: string) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((prev) => 
        prev.map((o) => (o.id === orderId ? updatedOrder : o))
      );
      return updatedOrder;
    } catch (err: any) {
      throw err.response?.data?.message || err.message || "Failed to update order status";
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    changeStatus,
  };
}
