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
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, merchantRes, allMerchantsRes, categoryRes, mallRes, productRes] = await Promise.all([
        adminService.getPlatformStats(),
        adminService.getPendingMerchants(),
        adminService.getAllMerchants(),
        categoryService.getPublicCategories(),
        mallService.getAllMalls(),
        adminService.getAllProducts()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (merchantRes.success) setMerchants(merchantRes.data);
      if (allMerchantsRes.success) setAllMerchants(allMerchantsRes.data);
      if (categoryRes.success) setCategories(categoryRes.data);
      if (mallRes.status === "success") setMalls(mallRes.data);
      if (productRes.success) setAllProducts(productRes.data);
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

  const toggleMerchantTrending = async (id: string) => {
    try {
      const res = await adminService.toggleMerchantTrending(id);
      if (res.success) {
        setAllMerchants(prev => prev.map(m => m.id === id ? { ...m, isTrending: !m.isTrending } : m));
      }
    } catch (err: any) {
      throw err.response?.data?.message || err.message || "Trending toggle failed";
    }
  };

  const toggleProductTrending = async (id: string) => {
    try {
      const res = await adminService.toggleProductTrending(id);
      if (res.success) {
        setAllProducts(prev => prev.map(p => p.id === id ? { ...p, isTrending: !p.isTrending } : p));
      }
    } catch (err: any) {
      throw err.response?.data?.message || err.message || "Trending toggle failed";
    }
  };

  const fetchMerchantDetails = async (id: string) => {
    setLoadingDetails(true);
    try {
      const res = await adminService.getMerchantDetails(id);
      if (res.success) setSelectedMerchant(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch merchant details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const updateMerchantProduct = async (productId: string, data: any) => {
    try {
      const res = await adminService.updateMerchantProduct(productId, data);
      if (res.success && selectedMerchant) {
        setSelectedMerchant({
          ...selectedMerchant,
          products: selectedMerchant.products.map((p: any) => p.id === productId ? res.data : p)
        });
      }
    } catch (err: any) {
      throw err.response?.data?.message || err.message || "Product update failed";
    }
  };

  const updateMerchantOrderItemStatus = async (orderItemId: string, status: string) => {
    try {
      const res = await adminService.updateMerchantOrderItemStatus(orderItemId, status);
      if (res.success && selectedMerchant) {
        setSelectedMerchant({
          ...selectedMerchant,
          orders: selectedMerchant.orders.map((o: any) => o.id === orderItemId ? { ...o, status: res.data.status } : o)
        });
      }
    } catch (err: any) {
      throw err.response?.data?.message || err.message || "Order status update failed";
    }
  };

  const clearSelectedMerchant = () => setSelectedMerchant(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    stats,
    merchants,
    allMerchants,
    categories,
    malls,
    allProducts,
    loading,
    error,
    approveMerchant,
    rejectMerchant,
    toggleMerchantTrending,
    toggleProductTrending,
    fetchMerchantDetails,
    updateMerchantProduct,
    updateMerchantOrderItemStatus,
    clearSelectedMerchant,
    selectedMerchant,
    loadingDetails,
    handleCategory,
    refresh: fetchAll
  };
}
