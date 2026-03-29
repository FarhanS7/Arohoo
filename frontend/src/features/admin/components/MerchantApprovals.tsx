"use client";

import { MerchantApplication } from "@/lib/api/admin";

interface MerchantApprovalsProps {
  merchants: MerchantApplication[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export default function MerchantApprovals({ merchants, onApprove, onReject }: MerchantApprovalsProps) {
  if (merchants.length === 0) {
    return (
      <div className="py-20 text-center bg-neutral-50 rounded-[2.5rem] border border-neutral-100">
        <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Queue is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-neutral-100 border border-neutral-100 overflow-hidden">
      <table className="min-w-full divide-y divide-neutral-100">
        <thead className="bg-neutral-50/50">
          <tr>
            <th className="px-10 py-6 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Merchant Profile</th>
            <th className="px-10 py-6 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Contact</th>
            <th className="px-10 py-6 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Applied</th>
            <th className="px-10 py-6 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {merchants.map((merchant) => (
            <tr key={merchant.id} className="hover:bg-neutral-50/30 transition-colors group">
              <td className="px-10 py-8 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-neutral-900 tracking-tighter uppercase">{merchant.businessName}</span>
                  <span className="text-xs text-neutral-500 font-bold">{merchant.ownerName}</span>
                </div>
              </td>
              <td className="px-10 py-8 whitespace-nowrap text-sm text-neutral-600 font-medium">
                {merchant.email}
              </td>
              <td className="px-10 py-8 whitespace-nowrap text-xs text-neutral-400 font-bold">
                {new Date(merchant.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </td>
              <td className="px-10 py-8 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => onReject(merchant.id)}
                    className="h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => onApprove(merchant.id)}
                    className="h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200"
                  >
                    Approve
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
