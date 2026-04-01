"use client";

import { MerchantApplication } from "@/lib/api/admin";
import { Star, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

interface MerchantManagerProps {
  merchants: MerchantApplication[];
  onToggleTrending: (id: string) => Promise<void>;
  onInspect: (id: string) => void;
  onRefresh: () => void;
}

export default function MerchantManager({ merchants, onToggleTrending, onInspect, onRefresh }: MerchantManagerProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (id: string) => {
    setLoadingId(id);
    try {
      await onToggleTrending(id);
    } catch (error) {
      console.error("Failed to toggle trending:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const approvedMerchants = merchants.filter(m => m.isApproved || m.status === "APPROVED");

  if (approvedMerchants.length === 0) {
    return (
      <div className="py-20 text-center bg-neutral-50 rounded-[2.5rem] border border-neutral-100 italic font-medium text-neutral-400">
        No verified merchants yet. Approve some stores first!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-neutral-100 border border-neutral-100 overflow-hidden">
      <table className="min-w-full divide-y divide-neutral-100">
        <thead className="bg-neutral-50/50">
          <tr>
            <th className="px-10 py-6 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Merchant Profile</th>
            <th className="px-10 py-6 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Curation Status</th>
            <th className="px-10 py-6 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {approvedMerchants.map((merchant) => (
            <tr key={merchant.id} className="hover:bg-neutral-50/30 transition-colors group">
              <td className="px-10 py-8 whitespace-nowrap">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg bg-black text-white`}>
                    {merchant.businessName.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-neutral-900 tracking-tighter uppercase">{merchant.businessName}</span>
                    <span className="text-xs text-neutral-500 font-bold">{merchant.ownerName}</span>
                  </div>
                </div>
              </td>
              <td className="px-10 py-8 whitespace-nowrap">
                {merchant.isTrending ? (
                  <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full w-fit border border-primary/20">
                    <TrendingUp className="w-3 h-3" />
                    Trending Brand
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-neutral-400 font-black text-[10px] uppercase tracking-widest bg-neutral-100 px-3 py-1.5 rounded-full w-fit">
                    Standard Store
                  </div>
                )}
              </td>
              <td className="px-10 py-8 whitespace-nowrap text-right">
                  <div className="flex items-center gap-3 ml-auto">
                    <button
                      onClick={() => onInspect(merchant.id)}
                      className="px-6 py-3 rounded-2xl text-[10px] bg-neutral-900 text-white font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                    >
                      Inspect Store
                    </button>
                    <button
                      onClick={() => handleToggle(merchant.id)}
                      disabled={loadingId === merchant.id}
                      className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                        merchant.isTrending 
                        ? "bg-amber-50 text-amber-600 hover:bg-amber-100 shadow-amber-100 border border-amber-200" 
                        : "bg-white text-neutral-900 hover:bg-black hover:text-white border border-neutral-100 shadow-neutral-100"
                      } flex items-center gap-2`}
                    >
                      {loadingId === merchant.id ? (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : merchant.isTrending ? (
                        <>
                          <XCircle className="w-3 h-3 text-amber-600" />
                          Remove
                        </>
                      ) : (
                        <>
                          <Star className="w-3 h-3" />
                          Trending
                        </>
                      )}
                    </button>
                  </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
