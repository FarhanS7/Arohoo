"use client";

import FilterPanel from "@/features/products/components/FilterPanel";
import ProductCard from "@/features/products/components/ProductCard";
import ProductCardSkeleton from "@/features/products/components/ProductCardSkeleton";
import { usePublicProducts } from "@/features/products/hooks/usePublicProducts";
import { useState, useEffect, Suspense } from "react";
import PageLayout from "@/components/layout/UX/PageLayout";
import { Filter, X, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPublicMerchants } from "@/lib/api/merchant";
import Image from "next/image";
import Link from "next/link";

function ProductCatalogContent() {
  const { 
    products, 
    loading, 
    error, 
    meta, 
    params, 
    updateParams 
  } = usePublicProducts({ limit: 12 });

  const [searchInput, setSearchInput] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Fetch related brands based on search query
  const { data: brandResults, isLoading: loadingBrands } = useQuery({
    queryKey: ["related-brands", params.q],
    queryFn: () => getPublicMerchants({ q: params.q, limit: 10 }),
    enabled: !!params.q,
  });

  const relatedBrands = brandResults?.data || [];

  // Sync search input with URL params (e.g. on manual URL change or browser back/forward)
  useEffect(() => {
    if (params.q !== undefined) {
      setSearchInput(params.q);
    } else {
      setSearchInput("");
    }
  }, [params.q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput });
  };

  return (
    <PageLayout showBackButton={true}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-2">
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-900"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {products.length} Items Found
            </span>
          </div>

          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0">
            <FilterPanel 
              currentParams={params}
              onFilterChange={updateParams}
            />
          </aside>

          {/* Mobile Filter Drawer */}
          {isFilterDrawerOpen && (
            <div className="fixed inset-0 z-[100] lg:hidden">
              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setIsFilterDrawerOpen(false)}
              />
              {/* Content */}
              <div className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-widest">Filters</h2>
                  <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <FilterPanel 
                    currentParams={params}
                    onFilterChange={(newParams) => {
                      updateParams(newParams);
                      // Don't close on every filter change for better UX, but maybe on some?
                    }}
                  />
                </div>
                <div className="p-6 border-t border-gray-100">
                  <button 
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="w-full py-4 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest"
                  >
                    Show {meta.total} Products
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid Area */}
          <main className="flex-grow">
            {/* Related Brands Section - Moved to Top for prominence */}
            {params.q && relatedBrands.length > 0 && (
              <section className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Related Brands</h3>
                  <div className="h-px flex-1 bg-neutral-100 mx-6" />
                </div>
                <div className="flex overflow-x-auto subtle-scrollbar gap-4 pb-4 px-1">
                  {relatedBrands.map((brand: any) => (
                    <Link
                      key={brand.id}
                      href={`/merchants/${brand.slug}`}
                      className="flex-shrink-0 group"
                    >
                      <div className="flex items-center gap-4 p-3 pr-6 bg-white border border-neutral-100 rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                        <div className="relative w-12 h-12 rounded-xl bg-neutral-50 overflow-hidden border border-neutral-50">
                          {brand.logo ? (
                            <Image
                              src={brand.logo}
                              alt={brand.storeName}
                              fill
                              className="object-contain p-1 group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-neutral-200 text-xs">
                              {brand.storeName.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900 group-hover:text-primary transition-colors">{brand.storeName}</h4>
                          <p className="text-[10px] font-medium text-neutral-400">View Brand Store</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-200 group-hover:text-primary group-hover:translate-x-1 transition-all ml-2" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

             <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
               <div className="hidden sm:block">
                 <span className="text-sm text-gray-500 font-medium">
                   Showing <span className="text-gray-900 font-extrabold">{products.length}</span> of <span className="text-gray-900 font-extrabold">{meta.total}</span> products
                 </span>
                 {params.q && (
                   <span className="ml-2 text-sm text-indigo-600 font-bold italic">
                     &ldquo;{params.q}&rdquo;
                   </span>
                 )}
               </div>
               
                {/* Sort Toggle */}
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-gray-400 uppercase">Sort by:</span>
                 <select 
                   value={params.sort || "newest"}
                   onChange={(e) => updateParams({ sort: e.target.value })}
                   className="text-xs font-bold border-none outline-none focus:ring-0 bg-transparent cursor-pointer"
                 >
                   <option value="newest">Newest Arrivals</option>
                   <option value="price_asc">Price: Low to High</option>
                   <option value="price_desc">Price: High to Low</option>
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
                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12">
                   {products.map((product, index) => (
                     <ProductCard key={product.id} product={product} priority={index < 4} />
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
    </PageLayout>
  );
}

export default function ProductCatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="text-xl font-bold italic tracking-tighter uppercase text-gray-300 animate-pulse">Loading Catalog...</div></div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}
