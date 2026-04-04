"use client";

import { useState, useCallback, useMemo } from "react";
import NextImage from "next/image";
import { Mall, CreateMallDTO, mallService } from "@/lib/api/mall";
import { MerchantApplication } from "@/lib/api/admin";
import { Plus, Edit2, Trash2, Users, X, Check, Search, MapPin, Image as ImageIcon } from "lucide-react";

interface MallManagerProps {
  malls: Mall[];
  allMerchants: MerchantApplication[];
  onRefresh: () => void;
}

export default function MallManager({ malls, allMerchants, onRefresh }: MallManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMerchantModalOpen, setIsMerchantModalOpen] = useState(false);
  const [selectedMall, setSelectedMall] = useState<Mall | null>(null);
  const [merchantSearch, setMerchantSearch] = useState("");
  const [formData, setFormData] = useState<CreateMallDTO>({
    name: "",
    location: "",
    description: "",
    coverImage: "",
  });
  const [loading, setLoading] = useState(false);

  const handleOpenCreate = useCallback(() => {
    setSelectedMall(null);
    setFormData({ name: "", location: "", description: "", coverImage: "" });
    setIsModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((mall: Mall) => {
    setSelectedMall(mall);
    setFormData({
      name: mall.name,
      location: mall.location,
      description: mall.description || "",
      coverImage: mall.coverImage || "",
    });
    setIsModalOpen(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedMall) {
        await mallService.updateMall(selectedMall.id, formData);
      } else {
        await mallService.createMall(formData);
      }
      onRefresh();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save mall:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this mall?")) return;
    try {
      await mallService.deleteMall(id);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete mall:", error);
    }
  }, [onRefresh]);

  const toggleMerchant = useCallback(async (mallId: string, merchantId: string, isAssigned: boolean) => {
    try {
      if (isAssigned) {
        await mallService.removeMerchantFromMall(mallId, merchantId);
      } else {
        await mallService.addMerchantToMall(mallId, merchantId);
      }
      onRefresh();
    } catch (error) {
      console.error("Failed to toggle merchant:", error);
    }
  }, [onRefresh]);

  // Memoize filtered merchants to prevent expensive filtering on every re-render
  const filteredMerchants = useMemo(() => {
    return allMerchants.filter(m => 
      m.businessName.toLowerCase().includes(merchantSearch.toLowerCase()) ||
      m.ownerName.toLowerCase().includes(merchantSearch.toLowerCase())
    );
  }, [allMerchants, merchantSearch]);

  // Memoize assignment check to prevent expensive lookups in the map
  const assignedMerchantIds = useMemo(() => {
    if (!selectedMall) return new Set<string>();
    const mall = malls.find(m => m.id === selectedMall.id);
    return new Set(mall?.merchants?.map(m => m.id) || []);
  }, [malls, selectedMall]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Destinations</h2>
          <p className="text-neutral-500 text-sm font-medium">Curate the premium shopping malls and assign merchants.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-200"
        >
          <Plus className="w-4 h-4" />
          Create Mall
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {malls.map((mall) => (
          <div key={mall.id} className="bg-white rounded-[2rem] border border-neutral-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-neutral-200 transition-all group">
            <div className="relative h-48 bg-neutral-100">
               {mall.coverImage ? (
                 <NextImage src={mall.coverImage} alt={mall.name} fill className="object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-neutral-300">
                    <ImageIcon className="w-12 h-12 opacity-20" />
                 </div>
               )}
               <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleOpenEdit(mall)} className="p-2 bg-white/90 backdrop-blur rounded-xl text-neutral-600 hover:text-primary shadow-lg"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(mall.id)} className="p-2 bg-white/90 backdrop-blur rounded-xl text-neutral-600 hover:text-red-500 shadow-lg"><Trash2 className="w-4 h-4" /></button>
               </div>
            </div>
            <div className="p-6">
               <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
                  <MapPin className="w-3 h-3" />
                  {mall.location}
               </div>
               <h3 className="text-xl font-black text-neutral-900 mb-2 truncate">{mall.name}</h3>
               <p className="text-neutral-400 text-xs font-medium line-clamp-2 mb-6 italic">
                {mall.description || "No description provided."}
               </p>
               
               <button 
                  onClick={() => { setSelectedMall(mall); setIsMerchantModalOpen(true); }}
                  className="w-full py-4 border border-neutral-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-neutral-500 hover:bg-neutral-50 transition-all group-hover:border-primary/20 group-hover:text-primary"
               >
                  <Users className="w-4 h-4" />
                  Manage Stores ({mall._count?.merchants || 0})
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-neutral-100">
            <div className="p-8 border-b border-neutral-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-neutral-900 tracking-tight">
                {selectedMall ? "Edit Destination" : "New Destination"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-neutral-400 hover:text-black transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Mall Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-4 bg-neutral-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-sm transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jamuna Future Park"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Location</label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-4 bg-neutral-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-sm transition-all"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Dhaka, Bangladesh"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Cover Image URL</label>
                <input
                  type="url"
                  className="w-full px-5 py-4 bg-neutral-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-sm transition-all"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  className="w-full px-5 py-4 bg-neutral-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium text-sm transition-all h-32 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the shopping experience..."
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-black text-white py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-neutral-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Syncing..." : "Save Destination"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Manage Merchants Modal */}
      {isMerchantModalOpen && selectedMall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col h-[80vh]">
            <div className="p-8 border-b border-neutral-50 flex items-center justify-between flex-shrink-0">
               <div>
                  <h3 className="text-xl font-black text-neutral-900 tracking-tight">Curate {selectedMall.name}</h3>
                  <p className="text-neutral-400 text-xs font-medium uppercase tracking-widest mt-1">Assign verified stores to this destination</p>
               </div>
              <button onClick={() => setIsMerchantModalOpen(false)} className="p-2 text-neutral-400 hover:text-black transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 border-b border-neutral-50 flex-shrink-0">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                  <input 
                    type="text" 
                    placeholder="Search premium merchants..." 
                    className="w-full pl-11 pr-4 py-4 bg-neutral-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 font-medium text-sm transition-all"
                    value={merchantSearch}
                    onChange={(e) => setMerchantSearch(e.target.value)}
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {filteredMerchants.map(merchant => {
                const isAssigned = assignedMerchantIds.has(merchant.id);
                
                return (
                  <div key={merchant.id} className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${isAssigned ? 'border-primary/20 bg-primary/5 shadow-sm' : 'border-neutral-100 hover:border-neutral-200'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs ${isAssigned ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                        {merchant.businessName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-neutral-900">{merchant.businessName}</h4>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{merchant.ownerName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleMerchant(selectedMall.id, merchant.id, isAssigned)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isAssigned ? 'bg-white text-primary shadow-sm hover:text-red-500' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}
                    >
                       {isAssigned ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="p-8 border-t border-neutral-50 bg-neutral-50/50 flex justify-end flex-shrink-0">
               <button 
                onClick={() => setIsMerchantModalOpen(false)}
                className="bg-black text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-neutral-200"
               >
                Finish Curation
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
