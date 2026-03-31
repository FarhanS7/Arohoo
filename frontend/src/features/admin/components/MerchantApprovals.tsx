import { useState } from "react";
import { MerchantApplication } from "@/lib/api/admin";
import { X, MapPin, Phone, Mail, User, Store, Calendar, Tag } from "lucide-react";

interface MerchantApprovalsProps {
  merchants: MerchantApplication[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export default function MerchantApprovals({ merchants, onApprove, onReject }: MerchantApprovalsProps) {
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantApplication | null>(null);

  if (merchants.length === 0) {
    return (
      <div className="py-20 text-center bg-neutral-50 rounded-[2.5rem] border border-neutral-100">
        <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Queue is empty</p>
      </div>
    );
  }

  return (
    <>
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
              <tr 
                key={merchant.id} 
                onClick={() => setSelectedMerchant(merchant)}
                className="hover:bg-neutral-50/30 transition-colors group cursor-pointer"
              >
                <td className="px-10 py-8 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-neutral-900 tracking-tighter uppercase">{merchant.businessName}</span>
                    <span className="text-xs text-neutral-500 font-bold">{merchant.ownerName}</span>
                  </div>
                </td>
                <td className="px-10 py-8 whitespace-nowrap text-sm text-neutral-600 font-medium lowercase">
                  {merchant.email}
                </td>
                <td className="px-10 py-8 whitespace-nowrap text-xs text-neutral-400 font-bold">
                  {new Date(merchant.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-10 py-8 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReject(merchant.id);
                      }}
                      className="h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      Reject
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove(merchant.id);
                      }}
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

      {/* Merchant Details Modal */}
      {selectedMerchant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col">
            <div className="p-8 pb-4 border-b border-neutral-50 flex items-center justify-between">
              <div>
                <nav className="flex mb-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] gap-3">
                  <span>Merchant Application</span>
                  <span className="text-neutral-200">/</span>
                  <span className="text-neutral-400">Review</span>
                </nav>
                <h3 className="text-3xl font-black text-neutral-900 tracking-tighter uppercase italic">
                  Store Profile
                </h3>
              </div>
              <button 
                onClick={() => setSelectedMerchant(null)} 
                className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-2xl text-neutral-400 hover:text-black transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-neutral-900">
                <div className="space-y-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                       <Store className="w-3 h-3" /> Shop Name
                    </span>
                    <p className="text-lg font-black tracking-tight uppercase italic">{selectedMerchant.businessName}</p>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                       <User className="w-3 h-3" /> Owner Name
                    </span>
                    <p className="text-sm font-bold text-neutral-600">{selectedMerchant.ownerName}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                       <Mail className="w-3 h-3" /> Email Address
                    </span>
                    <p className="text-sm font-bold text-neutral-600">{selectedMerchant.email}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                       <Phone className="w-3 h-3" /> Contact Phone
                    </span>
                    <p className="text-sm font-bold text-neutral-600">{selectedMerchant.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                       <MapPin className="w-3 h-3" /> Shop Address
                    </span>
                    <p className="text-sm font-bold text-neutral-600 leading-relaxed italic">
                      {selectedMerchant.address || 'Address information missing'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                       <Calendar className="w-3 h-3" /> Application Date
                    </span>
                    <p className="text-sm font-bold text-neutral-600">
                      {new Date(selectedMerchant.createdAt).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                       <Tag className="w-3 h-3" /> Categories
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedMerchant.categories?.map(cat => (
                        <span key={cat.id} className="px-3 py-1 bg-neutral-900 text-[9px] font-black text-white uppercase tracking-widest rounded-full italic">
                          {cat.name}
                        </span>
                      )) || <span className="text-xs text-neutral-400 font-bold uppercase italic">No categories assigned</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-neutral-50 bg-neutral-50/50 flex items-center justify-end gap-4 overflow-hidden">
              <button
                onClick={() => {
                  onReject(selectedMerchant.id);
                  setSelectedMerchant(null);
                }}
                className="h-14 px-10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-red-600 hover:bg-white transition-all border border-transparent hover:border-red-100"
              >
                Reject Application
              </button>
              <button
                onClick={() => {
                  onApprove(selectedMerchant.id);
                  setSelectedMerchant(null);
                }}
                className="h-14 px-10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] bg-black text-white hover:bg-neutral-800 transition-all shadow-2xl shadow-neutral-300"
              >
                Approve Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

