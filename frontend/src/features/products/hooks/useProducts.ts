import { CreateProductInput, Product, productService } from "@/lib/api/products";
import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook for managing merchant products
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });

  const fetchProducts = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getMerchantProducts(page, limit);
      if (response.success) {
        setProducts(response.data);
        setMeta(response.meta);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (data: CreateProductInput) => {
    setLoading(true);
    try {
      const response = await productService.createProduct(data);
      if (response.success) {
        await fetchProducts(meta.page, meta.limit);
        return response.data;
      }
    } catch (err: any) {
      throw err.response?.data?.message || err.message || "Failed to create product";
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, data: Partial<CreateProductInput>) => {
    setLoading(true);
    try {
      const response = await productService.updateProduct(id, data);
      if (response.success) {
        await fetchProducts(meta.page, meta.limit);
        return response.data;
      }
    } catch (err: any) {
      throw err.response?.data?.message || err.message || "Failed to update product";
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      const response = await productService.deleteProduct(id);
      if (response.success) {
        await fetchProducts(meta.page, meta.limit);
        return true;
      }
    } catch (err: any) {
      throw err.response?.data?.message || err.message || "Failed to delete product";
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (productId: string, files: File[]) => {
    setLoading(true);
    try {
      const response = await productService.uploadImages(productId, files);
      if (response.success) {
        await fetchProducts(meta.page, meta.limit);
        return response.data;
      }
    } catch (err: any) {
      throw err.response?.data?.message || err.message || "Failed to upload images";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    meta,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImages,
  };
}
