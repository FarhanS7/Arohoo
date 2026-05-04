import { api } from "./client";
import { cache } from "react";

export interface Merchant {
  id: string;
  storeName: string;
  slug: string;
  logo?: string;
  description?: string;
  bannerUrl?: string;
}

export interface Mall {
  id: string;
  name: string;
  location: string;
  coverImage?: string;
  description?: string;
  _count?: {
    merchants: number;
  };
  merchants?: Merchant[];
  createdAt: string;
  updatedAt: string;
}

export type CreateMallDTO = Omit<Mall, 'id' | 'createdAt' | 'updatedAt' | '_count' | 'merchants'>;

export const mallService = {
  /**
   * Public: Get all malls
   */
  getAllMalls: cache(async (): Promise<{ status: string; data: Mall[] }> => {
    const res = await api.get<{ status: string; data: Mall[] }>("/malls");
    return res.data;
  }),

  /**
   * Public: Get mall by ID (includes merchants)
   */
  getMallById: cache(async (id: string): Promise<{ status: string; data: Mall }> => {
    const res = await api.get<{ status: string; data: Mall }>(`/malls/${id}`);
    return res.data;
  }),

  /**
   * Admin: Create a new mall
   */
  async createMall(data: CreateMallDTO): Promise<{ status: string; data: Mall }> {
    const res = await api.post<{ status: string; data: Mall }>("/malls", data);
    return res.data;
  },

  /**
   * Admin: Update an existing mall
   */
  async updateMall(id: string, data: Partial<CreateMallDTO>): Promise<{ status: string; data: Mall }> {
    const res = await api.patch<{ status: string; data: Mall }>(`/malls/${id}`, data);
    return res.data;
  },

  /**
   * Admin: Delete a mall
   */
  async deleteMall(id: string): Promise<void> {
    await api.delete(`/malls/${id}`);
  },

  /**
   * Admin: Add a merchant to a mall
   */
  async addMerchantToMall(mallId: string, merchantId: string): Promise<{ status: string; data: Mall }> {
    const res = await api.post<{ status: string; data: Mall }>(`/malls/${mallId}/merchants`, { merchantId });
    return res.data;
  },

  /**
   * Admin: Remove a merchant from a mall
   */
  async removeMerchantFromMall(mallId: string, merchantId: string): Promise<{ status: string; data: Mall }> {
    const res = await api.delete<{ status: string; data: Mall }>(`/malls/${mallId}/merchants`, { data: { merchantId } });
    return res.data;
  },
};
