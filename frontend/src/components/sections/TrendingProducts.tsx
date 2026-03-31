"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { productService, Product } from "@/lib/api/products";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await productService.getPublicProducts({ isTrending: true, limit: 4 });
        if (res.success) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch trending products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 tracking-tight">Trending Selection</h2>
            <p className="text-sm sm:text-base text-gray-500 font-medium">Handpicked premium items trending across the platform.</p>
          </div>
          <Link href="/shop" className="hidden sm:block text-primary font-black text-xs uppercase tracking-widest hover:opacity-70 transition-all border-b-2 border-primary/20 pb-1">
            Explore All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <Link 
              href={`/product/${product.id}`}
              key={product.id} 
              className="group overflow-hidden rounded-xl sm:rounded-[2rem] bg-white border border-neutral-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="relative h-48 sm:h-80 w-full overflow-hidden bg-neutral-50">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-200 font-black text-4xl">
                    AROHOO
                  </div>
                )}
                <div className="absolute top-2 left-2 sm:top-5 sm:left-5 bg-black text-white text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                  Trending
                </div>
              </div>
              <div className="p-4 sm:p-7">
                <h3 className="font-black text-neutral-900 mb-1 sm:mb-2 text-xs sm:text-lg truncate tracking-tighter uppercase italic">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-xl font-black text-primary">৳{Number(product.basePrice).toLocaleString()}</span>
                  <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
            <Link href="/shop" className="text-xs font-black uppercase tracking-widest border border-primary text-primary py-4 px-8 rounded-2xl block">View All Selections</Link>
        </div>
      </div>
    </section>
  );
}
