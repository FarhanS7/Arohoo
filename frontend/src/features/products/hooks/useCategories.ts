"use client";

import { Category, categoryService } from "@/lib/api/categories";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch and cache public categories.
 * Uses React Query for automatic caching and revalidation.
 */
export function useCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public_categories"],
    queryFn: async () => {
      const res = await categoryService.getPublicCategories();
      if (!res.success) throw new Error("Failed to fetch categories");
      return res.data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (categories are stable)
  });

  return { 
    categories: data || [], 
    loading: isLoading,
    error 
  };
}
