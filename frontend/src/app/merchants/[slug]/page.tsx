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
  const { slug } = useParams();
  const { data: merchant, isLoading, error } = useQuery({
    queryKey: ["public-merchant", slug],
    queryFn: () => getPublicMerchantProfile(slug as string),
  });

  if (isLoading) {
    return (
      <PageLayout>
        <div className="responsive-container py-10 sm:py-16">
          <Skeleton className="h-[25vh] w-full rounded-2xl sm:rounded-[2rem] mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-12">
            <div className="space-y-6">
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
            <div className="lg:col-span-3">
              <div className="responsive-grid grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-60 w-full rounded-2xl" />)}
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
      <section className="relative h-[12vh] sm:h-[28vh] min-h-[120px] sm:min-h-[240px] bg-neutral-900 overflow-hidden">
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
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-4 sm:pt-0">
          <div className="relative w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-[1.5rem] bg-white border border-neutral-100 shadow-xl overflow-hidden mb-2 sm:mb-4 animate-in zoom-in duration-700">
            {merchant.logo ? (
              <Image 
                src={merchant.logo} 
                alt={merchant.storeName} 
                fill 
                className="object-contain p-2.5 sm:p-3"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black text-white font-black text-2xl italic">
                {merchant.storeName.substring(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
            {merchant.storeName}
          </h1>
          {merchant.isTrending && (
            <div className="mt-2 sm:mt-3 flex items-center gap-1 bg-primary text-white text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 sm:px-5 sm:py-2 rounded-full shadow-xl shadow-primary/40 animate-pulse">
              <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current" /> Trending
            </div>
          )}
        </div>
      </section>

      <div className="responsive-container py-6 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-10 lg:gap-12">
          {/* Sidebar / Info - Hidden on mobile per user request */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 sm:space-y-8">
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

            <div className="bg-neutral-50 p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-neutral-100 shadow-sm">
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
            <div className="flex items-end justify-between mb-6 sm:mb-8 border-b border-neutral-100 pb-4 sm:pb-8">
              <div>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tighter uppercase italic leading-none underline decoration-primary/20 decoration-2 sm:decoration-6 underline-offset-[6px] sm:underline-offset-[8px]">Catalog</h2>
              </div>
            </div>

            {merchant.products && merchant.products.length > 0 ? (
              <div className="responsive-grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {merchant.products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-16 sm:py-24 text-center bg-neutral-50 rounded-2xl sm:rounded-[2rem] border border-dashed border-neutral-200">
                <p className="text-neutral-400 font-black uppercase italic tracking-[0.2em] text-xs">No products published yet.</p>
                <p className="text-neutral-300 text-[10px] mt-3 font-black italic uppercase tracking-[0.3em]">Sign up for updates</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </PageLayout>
  );
}
