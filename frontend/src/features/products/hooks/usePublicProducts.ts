import { Product, productService } from "@/lib/api/products";
import { useCallback, useEffect, useState } from "react";

export function usePublicProducts(initialParams: any = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0 });
  const [params, setParams] = useState(initialParams);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = params.q 
        ? await productService.searchPublicProducts(params)
        : await productService.getPublicProducts(params);
        
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
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParams = (newParams: any) => {
    setParams((prev: any) => ({ ...prev, ...newParams, page: newParams.page || 1 }));
  };

  return {
    products,
    loading,
    error,
    meta,
    params,
    updateParams,
    refresh: fetchProducts,
  };
}
