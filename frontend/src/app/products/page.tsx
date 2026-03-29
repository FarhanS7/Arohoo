"use client";

import FilterPanel from "@/features/products/components/FilterPanel";
import ProductCard from "@/features/products/components/ProductCard";
import ProductCardSkeleton from "@/features/products/components/ProductCardSkeleton";
import { usePublicProducts } from "@/features/products/hooks/usePublicProducts";
import { useState } from "react";

export default function ProductCatalogPage() {
  const { 
    products, 
    loading, 
    error, 
    meta, 
    params, 
    updateParams 
  } = usePublicProducts({ limit: 12 });

  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gray-900 py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl uppercase italic">
              Sustainable Essentials
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
              Premium sandals and apparel crafted from recycled materials. Comfort that doesn't cost the Earth.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-10 max-w-md mx-auto relative group">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 px-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
              <button 
                type="submit"
                className="absolute right-3 top-2 bottom-2 px-5 bg-white text-gray-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
              >
                Find
              </button>
            </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <FilterPanel 
              currentParams={params}
              onFilterChange={updateParams}
            />
          </aside>

          {/* Product Grid Area */}
          <main className="flex-grow">
             <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
               <div>
                 <span className="text-sm text-gray-500 font-medium">
                   Showing <span className="text-gray-900 font-extrabold">{products.length}</span> of <span className="text-gray-900 font-extrabold">{meta.total}</span> products
                 </span>
                 {params.q && (
                   <span className="ml-2 text-sm text-indigo-600 font-bold italic">
                     &ldquo;{params.q}&rdquo;
                   </span>
                 )}
               </div>
               
               {/* Sort Toggle (Mock) */}
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-gray-400 uppercase">Sort by:</span>
                 <select className="text-xs font-bold border-none outline-none focus:ring-0 bg-transparent cursor-pointer">
                   <option>Newest Arrivals</option>
                   <option>Price: Low to High</option>
                   <option>Price: High to Low</option>
                 </select>
               </div>
             </div>

             {loading && products.length === 0 ? (
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                 {[...Array(6)].map((_, i) => (
                   <ProductCardSkeleton key={i} />
                 ))}
               </div>
             ) : products.length ===0 ? (
               <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase">No Results Found</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                  <button 
                    onClick={() => updateParams({ categoryId: undefined, q: undefined, minPrice: undefined, maxPrice: undefined, size: undefined })}
                    className="mt-6 text-sm font-bold text-indigo-600 underline"
                  >
                    Clear All Filters
                  </button>
               </div>
             ) : (
               <>
                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                   {products.map((product) => (
                     <ProductCard key={product.id} product={product} />
                   ))}
                 </div>

                 {/* Pagination */}
                 {meta.total > meta.limit && (
                   <div className="mt-20 flex justify-center gap-3">
                     <button
                        disabled={meta.page <= 1 || loading}
                        onClick={() => updateParams({ page: meta.page - 1 })}
                        className="px-6 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                     >
                       Prev
                     </button>
                     <div className="flex items-center px-4 text-sm font-bold text-gray-900">
                       Page {meta.page}
                     </div>
                     <button
                        disabled={meta.page * meta.limit >= meta.total || loading}
                        onClick={() => updateParams({ page: meta.page + 1 })}
                        className="px-6 py-3 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                     >
                       Next
                     </button>
                   </div>
                 )}
               </>
             )}
          </main>
        </div>
      </div>
    </div>
  );
}
