"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublicMerchants } from "@/lib/api/merchant";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TrendingBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingBrands() {
      try {
        const res = await getPublicMerchants({ isTrending: true, limit: 6 });
        if (res.success) {
          setBrands(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch trending brands:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrendingBrands();
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 mb-2 tracking-tight uppercase italic">Featured Houses</h2>
            <p className="text-neutral-500 font-medium tracking-tight">The most influential brand boutiques curated for you.</p>
          </div>
          <Link href="/brands" className="text-primary font-black text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-all border-b-2 border-primary/20 pb-1">
            View All Houses
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {brands.map((brand, index) => (
            <Link
              href={`/brand/${brand.id}`}
              key={brand.id}
              className="group relative h-40 flex flex-col items-center justify-center p-6 bg-neutral-50 hover:bg-white border-2 border-transparent hover:border-primary/20 rounded-[2.5rem] transition-all duration-500 transform hover:-translate-y-2 shadow-sm hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="relative w-full h-16 mb-4 filter grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.storeName}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-neutral-300 text-xl tracking-tighter italic">
                    {brand.storeName.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] group-hover:text-primary transition-colors text-center truncate w-full px-2">
                {brand.storeName}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
