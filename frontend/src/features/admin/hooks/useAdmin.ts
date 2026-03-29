import { adminService, MerchantApplication, PlatformStats } from "@/lib/api/admin";
import { Category, categoryService } from "@/lib/api/categories";
import { mallService, Mall } from "@/lib/api/mall";
import { useCallback, useEffect, useState } from "react";

export function useAdmin() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [merchants, setMerchants] = useState<MerchantApplication[]>([]);
  const [allMerchants, setAllMerchants] = useState<MerchantApplication[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, merchantRes, allMerchantsRes, categoryRes, mallRes] = await Promise.all([
        adminService.getPlatformStats(),
        adminService.getPendingMerchants(),
        adminService.getAllMerchants(),
        categoryService.getPublicCategories(),
        mallService.getAllMalls()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (merchantRes.success) setMerchants(merchantRes.data);
      if (allMerchantsRes.success) setAllMerchants(allMerchantsRes.data);
      if (categoryRes.success) setCategories(categoryRes.data);
      if (mallRes.status === "success") setMalls(mallRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  const approveMerchant = async (id: string) => {
    try {
      await adminService.approveMerchant(id);
      setMerchants(prev => prev.filter(m => m.id !== id));
      if (stats) setStats({ ...stats, pendingApprovals: stats.pendingApprovals - 1 });
    } catch (err: any) {
      throw err.response?.data?.message || err.message || "Approval failed";
    }
  };

  const rejectMerchant = async (id: string) => {
    try {
      await adminService.rejectMerchant(id);
      setMerchants(prev => prev.filter(m => m.id !== id));
      if (stats) setStats({ ...stats, pendingApprovals: stats.pendingApprovals - 1 });
    } catch (err: any) {
      throw err.response?.data?.message || err.message || "Rejection failed";
    }
  };

  const handleCategory = {
    create: async (data: Partial<Category>) => {
      const res = await adminService.createCategory(data);
      if (res.success) setCategories(prev => [...prev, res.data]);
      return res.data;
    },
    update: async (id: string, data: Partial<Category>) => {
      const res = await adminService.updateCategory(id, data);
      if (res.success) setCategories(prev => prev.map(c => c.id === id ? res.data : c));
      return res.data;
    },
    delete: async (id: string) => {
      await adminService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    stats,
    merchants,
    allMerchants,
    categories,
    malls,
    loading,
    error,
    approveMerchant,
    rejectMerchant,
    handleCategory,
    refresh: fetchAll
  };
}
