"use client";

import { Product, productService } from "@/lib/api/products";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export interface ProductSearchParams {
  page?: number;
  limit?: number;
  q?: string;
  categoryId?: string | number;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  sort?: string;
  [key: string]: any;
}

/**
 * Hook to fetch and cache public products with support for search and filtering.
 * Migrated to Next.js URL state for optimized global state and deep linking.
 */
export function usePublicProducts(initialParams: ProductSearchParams = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // DERIVE PARAMS FROM URL (The single source of truth)
  const params = useMemo(() => {
    const p: ProductSearchParams = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "12"),
      q: searchParams.get("q") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      sort: searchParams.get("sort") || "newest",
    };
    return p;
  }, [searchParams]);

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ["public_products", params],
    queryFn: async () => {
      // Use search endpoint only if query 'q' exists, otherwise use listing
      const response = params.q 
        ? await productService.searchPublicProducts(params)
        : await productService.getPublicProducts(params);
        
      if (!response.success) throw new Error("Failed to fetch products");
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache for listing views
  });

  const updateParams = useCallback((newParams: Partial<ProductSearchParams>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }
    });

    // Reset pagination to 1 if search or filter changes (unless explicitly setting page)
    const isResetTarget = newParams.q !== undefined || newParams.categoryId !== undefined || newParams.minPrice !== undefined || newParams.maxPrice !== undefined;
    if (isResetTarget && newParams.page === undefined) {
      current.set("page", "1");
    }

    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["public_products"] });
  }, [queryClient]);

  return {
    products: data?.data || [],
    loading: isLoading || isRefetching,
    error: error instanceof Error ? error.message : null,
    meta: data?.meta || { page: 1, limit: 12, total: 0 },
    params,
    updateParams,
    refresh,
  };
}
