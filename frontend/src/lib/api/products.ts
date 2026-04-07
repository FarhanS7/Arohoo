import { api } from "./client";
import { cache } from "react";

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  size: string | null;
  color: string | null;
}

export interface ProductImage {
  id?: string;
  url: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  categoryId: string;
  merchantId: string;
  merchant?: {
    id: string;
    storeName: string;
    logo?: string;
  };
  isTrending?: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  basePrice: number;
  categoryId: string;
  variants?: Omit<ProductVariant, 'id'>[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

// Temporary tracking for performance auditing
const requestTracker: Record<string, number> = {};

/**
 * Product API Service
 */
export const productService = {
  /**
   * Get all products for the current merchant
   */
  async getMerchantProducts(page = 1, limit = 20): Promise<PaginatedResponse<Product>> {
    const res = await api.get<PaginatedResponse<Product>>("/merchant/products", {
      params: { page, limit },
    });
    return res.data;
  },

  /**
   * Get a single product by ID
   */
  async getProductById(id: string): Promise<{ success: boolean; data: Product }> {
    const res = await api.get<{ success: boolean; data: Product }>(`/merchant/products/${id}`);
    return res.data;
  },

  /**
   * Create a new product
   */
  async createProduct(data: CreateProductInput): Promise<{ success: boolean; data: Product }> {
    const res = await api.post<{ success: boolean; data: Product }>("/merchant/products", data);
    return res.data;
  },

  /**
   * Update an existing product
   */
  async updateProduct(id: string, data: Partial<CreateProductInput>): Promise<{ success: boolean; data: Product }> {
    const res = await api.put<{ success: boolean; data: Product }>(`/merchant/products/${id}`, data);
    return res.data;
  },

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const res = await api.delete<{ success: boolean }>(`/merchant/products/${id}`);
    return res.data;
  },

  /**
   * Upload images for a product
   */
  async uploadImages(productId: string, files: File[]): Promise<{ success: boolean; data: ProductImage[] }> {
    console.log(`[API] Uploading ${files.length} images for product ${productId}`);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    // Use a fresh headers object to ensure browser sets the boundary
    const res = await api.post<{ success: boolean; data: ProductImage[] }>(
      `/merchant/products/${productId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Important: this allows Axios to correctly handle FormData boundaries
        transformRequest: [(data) => data], 
      }
    );
    return res.data;
  },

  /**
   * Get all public products (with filters)
   */
  getPublicProducts: cache(async (params: any): Promise<PaginatedResponse<Product>> => {
    const res = await api.get<PaginatedResponse<Product>>("/public/products", {
      params,
    });
    return res.data;
  }),

  /**
   * Search public products
   */
  searchPublicProducts: cache(async (params: any): Promise<PaginatedResponse<Product>> => {
    const res = await api.get<PaginatedResponse<Product>>("/public/products/search", {
      params,
    });
    return res.data;
  }),

  /**
   * Get trending products for landing page (Surgical query)
   */
  getTrendingProducts: cache(async (limit = 4): Promise<{ success: boolean; data: Product[] }> => {
    const res = await api.get<{ success: boolean; data: Product[] }>("/public/products/trending", {
      params: { limit },
    });
    return res.data;
  }),

  /**
   * Get public product details by ID
   */
  getPublicProductById: cache(async (id: string): Promise<{ success: boolean; data: Product }> => {
    const start = performance.now();
    requestTracker[id] = (requestTracker[id] || 0) + 1;
    
    // If this log appears, it means the React cache was BYPASSED (Network request triggered)
    console.log(`[PERF:API] NETWORK FETCH (ID: ${id}) - Global Total Calls: ${requestTracker[id]}`);
    
    try {
      const res = await api.get<{ success: boolean; data: Product }>(`/public/products/${id}`);
      const duration = performance.now() - start;
      console.log(`[PERF:API] FETCH END (ID: ${id}) - Duration: ${duration.toFixed(2)}ms`);
      return res.data;
    } catch (error) {
      console.log(`[PERF:API] FETCH FAILED (ID: ${id}) - Error: ${error instanceof Error ? error.message : 'Unknown'}`);
      throw error;
    }
  }),

  /**
   * Get public variant details by ID
   */
  getPublicVariantById: cache(async (id: string): Promise<{ success: boolean; data: any }> => {
    const res = await api.get<{ success: boolean; data: any }>(`/public/products/variants/${id}`);
    return res.data;
  }),
};
