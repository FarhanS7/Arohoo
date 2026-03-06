import { api } from "./client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export const categoryService = {
  async getPublicCategories(): Promise<{ success: boolean; data: Category[] }> {
    const res = await api.get<{ success: boolean; data: Category[] }>("/public/categories");
    return res.data;
  },
};
