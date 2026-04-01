import { Category } from "./categories";
import { api } from "./client";

export interface PlatformStats {
  totalUsers: number;
  totalMerchants: number;
  totalOrders: number;
  totalRevenue: number;
  pendingApprovals: number;
}

export interface MerchantApplication {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone?: string;
  address?: string;
  categories?: Category[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  isTrending: boolean;
  isApproved: boolean;
  createdAt: string;
}

export const adminService = {
  async getPlatformStats(): Promise<{ success: boolean; data: PlatformStats }> {
    const res = await api.get("/admin/stats");
    return res.data;
  },

  async getPendingMerchants(): Promise<{ success: boolean; data: MerchantApplication[] }> {
    const res = await api.get("/admin/merchants/pending");
    return res.data;
  },

  async getAllMerchants(): Promise<{ success: boolean; data: MerchantApplication[] }> {
    const res = await api.get("/admin/merchants");
    return res.data;
  },

  async approveMerchant(id: string): Promise<{ success: boolean }> {
    const res = await api.patch(`/admin/merchants/${id}/approve`);
    return res.data;
  },

  async rejectMerchant(id: string): Promise<{ success: boolean }> {
    const res = await api.patch(`/admin/merchants/${id}/reject`);
    return res.data;
  },

  async createCategory(data: Partial<Category>): Promise<{ success: boolean; data: Category }> {
    const res = await api.post("/admin/categories", data);
    return res.data;
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<{ success: boolean; data: Category }> {
    const res = await api.patch(`/admin/categories/${id}`, data);
    return res.data;
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data;
  },

  async toggleMerchantTrending(id: string): Promise<{ success: boolean; data: any }> {
    const res = await api.patch(`/admin/merchants/${id}/trending`);
    return res.data;
  },
  
  async getAllProducts(): Promise<{ success: boolean; data: any[] }> {
    const res = await api.get("/admin/products");
    return res.data;
  },

  async toggleProductTrending(id: string): Promise<{ success: boolean; data: any }> {
    const res = await api.patch(`/admin/products/${id}/trending`);
    return res.data;
  },

  async getMerchantDetails(id: string): Promise<{ success: boolean; data: any }> {
    const res = await api.get(`/admin/merchants/${id}`);
    return res.data;
  },

  async updateMerchantProduct(productId: string, data: any): Promise<{ success: boolean; data: any }> {
    const res = await api.patch(`/admin/products/${productId}`, data);
    return res.data;
  },

  async updateMerchantOrderItemStatus(orderItemId: string, status: string): Promise<{ success: boolean; data: any }> {
    const res = await api.patch(`/admin/orders/items/${orderItemId}/status`, { status });
    return res.data;
  },
};
