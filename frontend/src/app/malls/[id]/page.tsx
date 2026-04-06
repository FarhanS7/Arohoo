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
        <Skeleton className="h-[60vh] w-full" />
        <div className="responsive-container py-20">
          <Skeleton className="h-10 w-96 mb-6" />
          <div className="responsive-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!mall) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-black text-gray-300">Mall not found</h1>
          <Link href="/malls" className="mt-4 text-primary font-bold hover:underline">Back to Destinations</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBackButton={true}>
      {/* Mall Hero */}
      <section className="relative h-[65vh] min-h-[500px] overflow-hidden">
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
        <div className="absolute inset-0 flex flex-col justify-end pb-20">
          <div className="responsive-container w-full">
            <Link 
              href="/malls" 
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Destinations</span>
            </Link>
            
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border border-white/20 shadow-xl shadow-primary/20">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white/90">{mall.location}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none italic uppercase">
                {mall.name}
              </h1>
              <p className="text-white/60 text-lg font-medium leading-relaxed italic">
                "{mall.description || `Experience exclusive shopping at ${mall.name}, perfectly situated in ${mall.location}.`}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stores Section - Standardized Grid */}
      <main className="fluid-py bg-white">
        <div className="responsive-container">
          <div className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic underline decoration-primary/20 decoration-4 underline-offset-8">Available Stores</h2>
            <p className="text-gray-400 font-medium mt-4 uppercase tracking-[0.2em] text-[10px]">Curated retailers at this destination</p>
          </div>

          {mall.merchants && mall.merchants.length > 0 ? (
            <div className="responsive-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {mall.merchants.map((merchant) => (
                <Link
                  key={merchant.id}
                  href={`/merchants/${merchant.id}`}
                  className="group bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-primary/5 border border-neutral-100 hover:border-primary/10 transition-all duration-500 flex flex-col"
                >
                  <div className="relative aspect-square w-full mb-6 overflow-hidden rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
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

                  <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-primary transition-colors uppercase italic tracking-tighter">
                    {merchant.storeName}
                  </h3>
                  <p className="text-gray-400 text-xs font-medium leading-relaxed line-clamp-2 mb-6 italic">
                    {merchant.description || "Discover the latest styles and exclusive collections."}
                  </p>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">View Store</span>
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-neutral-50 rounded-[3rem] border border-neutral-100">
              <h3 className="text-xl font-black text-neutral-300 uppercase italic">No stores linked yet.</h3>
              <p className="text-neutral-400 mt-2 italic font-medium">Digital doors are opening soon!</p>
              <Link 
                href="/merchant/signup" 
                className="mt-8 inline-block bg-primary text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-primary/20 active:scale-95"
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
