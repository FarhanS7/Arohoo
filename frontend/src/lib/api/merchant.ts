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

export const getMerchantProfile = async (): Promise<any> => {
  const { data } = await api.get("/merchant/profile");
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

export const updateMerchantProfile = async (profileData: any): Promise<any> => {
  const { data } = await api.patch("/merchant/profile", profileData);
  return data.data;
};

export const uploadMerchantLogo = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("logo", file);
  const { data } = await api.post("/merchants/profile/logo/merchant", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const uploadMerchantBanner = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("banner", file);
  const { data } = await api.post("/merchants/profile/banner/merchant", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const getPublicMerchantProfile = async (id: string): Promise<any> => {
  const { data } = await api.get(`/merchants/public/${id}`);
  return data.data;
};

export const getPublicMerchants = async (params: any): Promise<any> => {
  const { data } = await api.get("/public/merchants", { params });
  return data;
};
