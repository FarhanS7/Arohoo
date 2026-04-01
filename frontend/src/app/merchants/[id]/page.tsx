"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPublicMerchantProfile } from "@/lib/api/merchant";
import ProductCard from "@/features/products/components/ProductCard";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";
import { MapPin, ShoppingBag, Info, Star } from "lucide-react";

export default function MerchantProfilePage() {
  const { id } = useParams();
  const { data: merchant, isLoading, error } = useQuery({
    queryKey: ["public-merchant", id],
    queryFn: () => getPublicMerchantProfile(id as string),
  });

  if (isLoading) return <div className="py-20"><DashboardSkeleton /></div>;
  if (error || !merchant) return <div className="py-20 text-center">Merchant not found.</div>;

  const getImageUrl = (url?: string) => {
    if (!url) return null;
    return url;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero / Banner Section */}
      <section className="relative h-[40vh] min-h-[400px] bg-neutral-900 overflow-hidden">
        {merchant.bannerUrl ? (
          <Image 
            src={getImageUrl(merchant.bannerUrl)!} 
            alt={merchant.storeName} 
            fill 
            className="object-cover opacity-60 scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 opacity-50" />
        )}
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-white border-4 border-white shadow-2xl overflow-hidden mb-6 animate-in zoom-in duration-700">
            {merchant.logo ? (
              <Image 
                src={getImageUrl(merchant.logo)!} 
                alt={merchant.storeName} 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black text-white font-black text-4xl italic">
                {merchant.storeName.substring(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase italic drop-shadow-xl animate-in slide-in-from-bottom-4 duration-700">
            {merchant.storeName}
          </h1>
          {merchant.isTrending && (
            <div className="mt-4 flex items-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
              <Star className="w-3 h-3 fill-current" /> Trending Brand
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Sidebar / Info */}
          <aside className="lg:col-span-1 space-y-12">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <Info className="w-3 h-3" /> Brand Story
              </h3>
              <p className="text-neutral-600 font-medium leading-relaxed">
                {merchant.description || "No description provided for this brand."}
              </p>
            </div>

            <div className="space-y-6 pt-8 border-t border-neutral-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Store Details</h3>
              <div className="space-y-4">
                {merchant.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-bold text-neutral-800">{merchant.address}</span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <ShoppingBag className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-bold text-neutral-800">{merchant._count.products} Exclusive Products</span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 p-8 rounded-[2rem] border border-neutral-100">
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900 mb-4">Arohoo Verified</h4>
                <p className="text-xs text-neutral-500 font-medium leading-normal">
                    This brand has been verified by the Arohoo curation team for quality and authenticity.
                </p>
            </div>
          </aside>

          {/* Main Content / Products */}
          <main className="lg:col-span-3">
            <div className="flex items-end justify-between mb-12 border-b border-neutral-100 pb-8">
              <div>
                <h2 className="text-3xl font-black text-neutral-900 tracking-tight uppercase italic leading-none">Catalog</h2>
                <p className="text-neutral-500 font-medium text-sm mt-2 uppercase tracking-widest">
                    Showing latest arrivals
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] block mb-1">Curation</span>
                <span className="text-xs font-black text-black">A-Z SELECTION</span>
              </div>
            </div>

            {merchant.products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {merchant.products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-neutral-50 rounded-[3rem] border border-dashed border-neutral-200">
                <p className="text-neutral-400 font-bold italic">This merchant hasn't published any products yet.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
