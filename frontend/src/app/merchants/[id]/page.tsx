"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPublicMerchantProfile } from "@/lib/api/merchant";
import ProductCard from "@/features/products/components/ProductCard";
import PageLayout from "@/components/layout/UX/PageLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { MapPin, ShoppingBag, Info, Star } from "lucide-react";

export default function MerchantProfilePage() {
  const { id } = useParams();
  const { data: merchant, isLoading, error } = useQuery({
    queryKey: ["public-merchant", id],
    queryFn: () => getPublicMerchantProfile(id as string),
  });

  if (isLoading) {
    return (
      <PageLayout>
        <div className="responsive-container py-20">
          <Skeleton className="h-[40vh] w-full rounded-[3rem] mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
            <div className="space-y-8">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
            <div className="lg:col-span-3">
              <div className="responsive-grid grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !merchant) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-black text-neutral-300 uppercase italic text-shadow-sm">Merchant not found</h1>
          <Link href="/merchants" className="mt-8 text-primary font-black uppercase tracking-[0.2em] hover:text-black transition-colors">Explore Brands</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBackButton={true}>
      {/* Hero / Banner Section */}
      <section className="relative h-[40vh] min-h-[400px] bg-neutral-900 overflow-hidden">
        {merchant.bannerUrl ? (
          <Image 
            src={merchant.bannerUrl} 
            alt={merchant.storeName} 
            fill 
            className="object-cover opacity-60 scale-105"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 opacity-50" />
        )}
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-[2.5rem] bg-white border border-neutral-100 shadow-2xl overflow-hidden mb-6 animate-in zoom-in duration-700">
            {merchant.logo ? (
              <Image 
                src={merchant.logo} 
                alt={merchant.storeName} 
                fill 
                className="object-contain p-4"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black text-white font-black text-4xl italic">
                {merchant.storeName.substring(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl animate-in slide-in-from-bottom-4 duration-700 text-shadow-xl">
            {merchant.storeName}
          </h1>
          {merchant.isTrending && (
            <div className="mt-6 flex items-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full shadow-2xl shadow-primary/40 animate-pulse">
              <Star className="w-3 h-3 fill-current" /> Trending Brand
            </div>
          )}
        </div>
      </section>

      <div className="responsive-container py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Sidebar / Info */}
          <aside className="lg:col-span-1 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <Info className="w-4 h-4 text-neutral-900" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900">Brand Story</h3>
              </div>
              <p className="text-neutral-500 font-medium leading-relaxed italic">
                "{merchant.description || `Discover the exclusive collection by ${merchant.storeName}, curated specifically for the Arohoo marketplace.`}"
              </p>
            </div>

            <div className="space-y-6 pt-8 border-t border-neutral-100">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Store Details</h3>
              <div className="space-y-5">
                {merchant.address && (
                  <div className="flex items-start gap-3 group">
                    <MapPin className="w-4 h-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
                    <span className="text-sm font-bold text-neutral-800">{merchant.address}</span>
                  </div>
                )}
                <div className="flex items-start gap-3 group">
                  <ShoppingBag className="w-4 h-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
                  <span className="text-sm font-bold text-neutral-800">{merchant._count?.products || merchant.products?.length || 0} Exclusive Products</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Arohoo Verified</h4>
                </div>
                <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">
                    This brand has been verified by our curation team for high quality and authentic manufacturing standards.
                </p>
            </div>
          </aside>

          {/* Main Content / Products */}
          <main className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-neutral-100 pb-10 gap-6">
              <div>
                <h2 className="text-4xl lg:text-5xl font-black text-neutral-900 tracking-tighter uppercase italic leading-none underline decoration-primary/20 decoration-8 underline-offset-[12px]">Catalog</h2>
                <p className="text-neutral-400 font-black mt-6 uppercase tracking-[0.3em] text-[10px]">
                    Displaying limited selection
                </p>
              </div>
              <div className="flex items-center gap-4 bg-neutral-50 px-6 py-3 rounded-2xl border border-neutral-100">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest border-r border-neutral-200 pr-4">Curation</span>
                <span className="text-xs font-black text-black tracking-widest uppercase italic">A-Z SELECTION</span>
              </div>
            </div>

            {merchant.products && merchant.products.length > 0 ? (
              <div className="responsive-grid grid-cols-2 lg:grid-cols-3">
                {merchant.products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-neutral-50 rounded-[3rem] border border-dashed border-neutral-200">
                <p className="text-neutral-400 font-black uppercase italic tracking-[0.2em] text-xs">No products published yet.</p>
                <p className="text-neutral-300 text-[10px] mt-4 font-black italic uppercase tracking-[0.3em]">Sign up for updates</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </PageLayout>
  );
}
