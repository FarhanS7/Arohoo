"use client";

import { useState } from "react";
import { Star, TrendingUp, XCircle, Search, Store, LayoutGrid, List } from "lucide-react";
import Image from "next/image";

interface ProductManagerProps {
  products: any[];
  onToggleTrending: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export default function ProductManager({ products, onToggleTrending, onRefresh }: ProductManagerProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.merchant?.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getImageUrl = (url?: string) => {
    if (!url) return null;
    return url;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-100">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text"
            placeholder="Search products, merchants, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
          />
        </div>
        <div className="flex gap-4">
           <div className="bg-neutral-50 px-6 py-4 rounded-2xl border border-neutral-100 flex items-center gap-3">
             <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total</span>
             <span className="text-sm font-black text-black">{filteredProducts.length}</span>
           </div>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-neutral-100 border border-neutral-100 overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-100">
          <thead className="bg-neutral-50/50">
            <tr>
              <th className="px-10 py-6 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Product Details</th>
              <th className="px-10 py-6 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Merchant</th>
              <th className="px-10 py-6 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Curation</th>
              <th className="px-10 py-6 text-right text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50/30 transition-colors group">
                <td className="px-10 py-8 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl bg-neutral-100 overflow-hidden shadow-sm">
                      {product.images?.[0]?.url ? (
                        <Image 
                          src={getImageUrl(product.images[0].url)!} 
                          alt={product.name} 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300 font-black text-xs">
                          NO IMG
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-neutral-900 tracking-tighter uppercase italic leading-none">{product.name}</h4>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
                        {product.category?.name || "Uncategorized"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8 whitespace-nowrap">
                   <div className="flex items-center gap-2 text-neutral-700 font-black text-[10px] uppercase tracking-widest bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-100 w-fit">
                    <Store className="w-3 h-3 text-neutral-400" />
                    {product.merchant?.storeName}
                  </div>
                </td>
                <td className="px-10 py-8 whitespace-nowrap text-sm font-extrabold text-neutral-900">
                  {product.isTrending ? (
                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full w-fit border border-primary/20">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-neutral-400 font-black text-[10px] uppercase tracking-widest bg-neutral-100 px-3 py-1.5 rounded-full w-fit">
                      Standard
                    </div>
                  )}
                </td>
                <td className="px-10 py-8 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleToggle(product.id)}
                    disabled={loadingId === product.id}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                      product.isTrending 
                      ? "bg-amber-50 text-amber-600 hover:bg-amber-100 shadow-amber-100 border border-amber-200" 
                      : "bg-white text-neutral-900 hover:bg-black hover:text-white border border-neutral-100 shadow-neutral-100"
                    } flex items-center gap-2 ml-auto`}
                  >
                    {loadingId === product.id ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : product.isTrending ? (
                      <>
                        <XCircle className="w-3 h-3" />
                        Remove Trending
                      </>
                    ) : (
                      <>
                        <Star className="w-3 h-3" />
                        Set Trending
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
