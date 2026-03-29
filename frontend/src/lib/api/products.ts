import { api } from "./client";

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: {
    size: string | null;
    color: string | null;
  };
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
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const res = await api.post<{ success: boolean; data: ProductImage[] }>(
      `/merchant/products/${productId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },

  /**
   * Get all public products (with filters)
   */
  async getPublicProducts(params: any): Promise<PaginatedResponse<Product>> {
    const res = await api.get<PaginatedResponse<Product>>("/public/products", {
      params,
    });
    return res.data;
  },

  /**
   * Search public products
   */
  async searchPublicProducts(params: any): Promise<PaginatedResponse<Product>> {
    const res = await api.get<PaginatedResponse<Product>>("/public/products/search", {
      params,
    });
    return res.data;
  },

  /**
   * Get public product details by ID
   */
  async getPublicProductById(id: string): Promise<{ success: boolean; data: Product }> {
    const res = await api.get<{ success: boolean; data: Product }>(`/public/products/${id}`);
    return res.data;
  },
};
