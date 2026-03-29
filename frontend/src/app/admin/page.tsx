"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";
import { useAdmin } from "@/features/admin/hooks/useAdmin";
import dynamic from "next/dynamic";
import { useState } from "react";

const MerchantApprovals = dynamic(() => import("@/features/admin/components/MerchantApprovals"), {
  loading: () => <div className="h-96 w-full bg-gray-50 animate-pulse rounded-2xl" />,
});

const CategoryManager = dynamic(() => import("@/features/admin/components/CategoryManager"), {
  loading: () => <div className="h-96 w-full bg-gray-50 animate-pulse rounded-2xl" />,
});

const MallManager = dynamic(() => import("@/features/admin/components/MallManager"), {
  loading: () => <div className="h-96 w-full bg-gray-50 animate-pulse rounded-2xl" />,
});

export default function AdminDashboardPage() {
  const { stats, merchants, allMerchants, categories, malls, loading, approveMerchant, rejectMerchant, handleCategory, refresh } = useAdmin();
  const [activeTab, setActiveTab] = useState<"approvals" | "categories" | "malls">("approvals");

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <nav className="flex mb-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] gap-3">
            <span>Control Panel</span>
            <span className="text-neutral-200">/</span>
            <span className="text-blackCondensed">Overview</span>
          </nav>
          <h1 className="text-6xl font-black text-neutral-900 tracking-tighter uppercase italic">
            Platform Ops
          </h1>
          <p className="mt-4 text-xl text-neutral-500 font-medium max-w-2xl">
            Scale the ecosystem by curating top-tier merchants and maintaining a premium product hierarchy.
          </p>
        </div>

        {/* Holistic Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-16">
          <div className="bg-black p-10 rounded-[2.5rem] text-white shadow-2xl shadow-neutral-300">
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Platform Revenue</h3>
            <p className="text-4xl font-black leading-none">৳{stats?.totalRevenue.toLocaleString() || '0'}</p>
          </div>
          <div className="bg-neutral-50 p-10 rounded-[2.5rem] border border-neutral-100">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Active Merchants</h3>
            <p className="text-4xl font-black text-neutral-900 leading-none">{stats?.totalMerchants || '0'}</p>
          </div>
          <div className="bg-neutral-50 p-10 rounded-[2.5rem] border border-neutral-100">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Users</h3>
            <p className="text-4xl font-black text-neutral-900 leading-none">{stats?.totalUsers || '0'}</p>
          </div>
          <div className={`p-10 rounded-[2.5rem] border transition-all ${merchants.length > 0 ? 'bg-amber-50 border-amber-100 animate-pulse' : 'bg-neutral-50 border-neutral-100'}`}>
            <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${merchants.length > 0 ? 'text-amber-600' : 'text-neutral-400'}`}>Approvals Queue</h3>
            <p className={`text-4xl font-black leading-none ${merchants.length > 0 ? 'text-amber-600' : 'text-neutral-900'}`}>{merchants.length}</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-12 border-b border-neutral-100 mb-12">
          <button
            onClick={() => setActiveTab("approvals")}
            className={`pb-6 text-xs font-black uppercase tracking-widest relative transition-colors ${activeTab === "approvals" ? "text-black" : "text-neutral-400 hover:text-neutral-600"}`}
          >
            Merchant Approvals
            {activeTab === "approvals" && <div className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`pb-6 text-xs font-black uppercase tracking-widest relative transition-colors ${activeTab === "categories" ? "text-black" : "text-neutral-400 hover:text-neutral-600"}`}
          >
            Category Manager
            {activeTab === "categories" && <div className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab("malls")}
            className={`pb-6 text-xs font-black uppercase tracking-widest relative transition-colors ${activeTab === "malls" ? "text-black" : "text-neutral-400 hover:text-neutral-600"}`}
          >
            Mall Management
            {activeTab === "malls" && <div className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-full" />}
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="animate-in fade-in duration-500">
          {activeTab === "approvals" ? (
            <MerchantApprovals 
              merchants={merchants}
              onApprove={approveMerchant}
              onReject={rejectMerchant}
            />
          ) : activeTab === "categories" ? (
            <CategoryManager 
              categories={categories}
              onCreate={handleCategory.create}
              onUpdate={handleCategory.update}
              onDelete={handleCategory.delete}
            />
          ) : (
            <MallManager 
              malls={malls}
              allMerchants={allMerchants}
              onRefresh={refresh}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
