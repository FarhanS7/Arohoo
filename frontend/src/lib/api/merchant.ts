import { api } from "./client";
import { Order } from "./orders";

export interface MerchantStats {
  totalRevenue: number;
  totalSales: number;
  fulfillmentRate: number;
  lowStockProducts: number;
}

export const getMerchantStats = async (): Promise<MerchantStats> => {
  const { data } = await api.get("/merchant/stats");
  return data.data;
};

export const getMerchantOrders = async (): Promise<Order[]> => {
  const { data } = await api.get("/merchant/orders");
  return data.data;
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<Order> => {
  const { data } = await api.patch(`/merchant/orders/${orderId}/status`, { status });
  return data.data;
};
