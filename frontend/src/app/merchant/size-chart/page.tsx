"use client";

import SizeChartSettings from "@/features/merchant/components/SizeChartSettings";
import { getMerchantProfile } from "@/lib/api/merchant";
import { useQuery } from "@tanstack/react-query";
import ProtectedRoute from "@/components/auth/protected-route";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";

export default function MerchantSizeChartPage() {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["merchant-profile"],
    queryFn: getMerchantProfile,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-red-500 font-bold">
        Failed to load profile. Please try again.
      </div>
    );
  }

  const isFashionMerchant = profile?.categories?.some((cat: any) => {
    const name = cat.name.toLowerCase();
    return name.includes("fashion") || 
           name.includes("men") || 
           name.includes("women") || 
           name.includes("kids") || 
           name.includes("shoes");
  });

  if (!isFashionMerchant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Access Restricted</h1>
        <p className="mt-4 text-neutral-500">The Size Chart feature is only available for Fashion category merchants.</p>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["MERCHANT"]}>
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-16 border-b border-neutral-100 pb-12">
            <nav className="flex mb-6 text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] gap-3">
              <span className="hover:text-black cursor-pointer transition-colors">Merchant Portal</span>
              <span className="text-neutral-200">/</span>
              <span className="text-black">Size Chart</span>
            </nav>
            <h1 className="text-5xl font-black text-neutral-900 tracking-tighter sm:text-6xl italic uppercase">
              Size Guide
            </h1>
            <p className="mt-4 text-lg text-neutral-500 font-medium max-w-2xl">
              Manage your store's universal size chart. This chart will be displayed on all your product pages to help customers find their perfect fit.
            </p>
          </header>

          <SizeChartSettings initialData={profile} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
