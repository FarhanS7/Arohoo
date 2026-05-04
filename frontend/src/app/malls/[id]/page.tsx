"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { mallService, Mall } from "@/lib/api/mall";
import PageLayout from "@/components/layout/UX/PageLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { MapPin, ArrowUpRight, ShoppingBag, ArrowLeft } from "lucide-react";

export default function MallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mall, setMall] = useState<Mall | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMall() {
      try {
        const res = await mallService.getMallById(id);
        if (res.status === "success") {
          setMall(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch mall details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMall();
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <Skeleton className="h-[25vh] w-full" />
        <div className="responsive-container py-10 sm:py-16">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="responsive-grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!mall) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-black text-neutral-300 uppercase italic text-shadow-sm">Mall not found</h1>
          <Link href="/malls" className="mt-8 text-primary font-black uppercase tracking-[0.2em] hover:text-black transition-colors">Back to Destinations</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBackButton={true}>
      {/* Mall Hero */}
      <section className="relative h-[28vh] sm:h-[35vh] min-h-[200px] sm:min-h-[280px] overflow-hidden">
        {mall.coverImage ? (
          <Image
            src={mall.coverImage}
            alt={mall.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] to-[#2d124a]" />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-[#1a0b2e]/40 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end pb-6 sm:pb-10">
          <div className="responsive-container w-full">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center border border-white/20 shadow-lg shadow-primary/20">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </div>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white/90">{mall.location}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-3 tracking-tighter leading-none italic uppercase">
                {mall.name}
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-medium leading-relaxed italic line-clamp-2">
                "{mall.description || `Experience exclusive shopping at ${mall.name}, perfectly situated in ${mall.location}.`}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stores Section - Standardized Grid */}
      <main className="fluid-py bg-white">
        <div className="responsive-container">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tighter uppercase italic underline decoration-primary/20 decoration-4 sm:decoration-6 underline-offset-[8px]">Available Stores</h2>
            <p className="text-neutral-400 font-black mt-3 sm:mt-4 uppercase tracking-[0.3em] text-[9px] sm:text-[10px]">Curated retailers at this destination</p>
          </div>

          {mall.merchants && mall.merchants.length > 0 ? (
            <div className="responsive-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {mall.merchants.map((merchant) => (
                <Link
                  key={merchant.id}
                  href={`/merchants/${merchant.slug}`}
                  className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg shadow-gray-200/50 hover:shadow-primary/5 border border-neutral-100 hover:border-primary/10 transition-all duration-500 flex flex-col"
                >
                  <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                    {merchant.logo ? (
                      <Image
                        src={merchant.logo}
                        alt={merchant.storeName}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <ShoppingBag className="w-12 h-12 text-gray-200 group-hover:text-primary transition-colors duration-500" />
                    )}
                    
                    <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="bg-primary text-white p-2 rounded-xl shadow-lg">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-gray-900 mb-1 truncate group-hover:text-primary transition-colors uppercase italic tracking-tighter">
                    {merchant.storeName}
                  </h3>
                  <p className="text-gray-400 text-[10px] sm:text-xs font-medium leading-relaxed line-clamp-2 mb-4 italic">
                    {merchant.description || "Discover the latest styles and exclusive collections."}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">View Store</span>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-24 bg-neutral-50 rounded-2xl sm:rounded-[2rem] border border-neutral-100">
              <h3 className="text-lg sm:text-xl font-black text-neutral-300 uppercase italic">No stores linked yet.</h3>
              <p className="text-neutral-400 mt-2 italic font-medium text-sm">Digital doors are opening soon!</p>
              <Link 
                href="/merchant/signup" 
                className="mt-6 inline-block bg-primary text-white px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-primary/20 active:scale-95"
              >
                Partner with Us
              </Link>
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
}
