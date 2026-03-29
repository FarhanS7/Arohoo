"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { mallService, Mall } from "@/lib/api/mall";
import Navbar from "@/components/layout/Navbar";
import { Skeleton } from "@/components/ui/Skeleton";
import { MapPin, ArrowLeft, ArrowUpRight, ShoppingBag } from "lucide-react";

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
      <div className="min-h-screen bg-white pt-20">
        <Navbar />
        <Skeleton className="h-[60vh] w-full" />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <Skeleton className="h-10 w-96 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!mall) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <Navbar />
        <h1 className="text-2xl font-black text-gray-300">Mall not found</h1>
        <Link href="/malls" className="mt-4 text-primary font-bold hover:underline">Back to Destinations</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 selection:bg-primary/20">
      <Navbar />
      
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
          <div className="max-w-7xl mx-auto px-4 w-full">
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
              <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
                {mall.name}
              </h1>
              <p className="text-white/60 text-lg font-medium leading-relaxed italic">
                "{mall.description || `Experience exclusive shopping at ${mall.name}, perfectly situated in ${mall.location}.`}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stores Section */}
      <main className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Available Stores</h2>
            <p className="text-gray-400 font-medium mt-1 uppercase tracking-widest text-[10px]">Explore the curated retailers in this destination</p>
          </div>
        </div>

        {mall.merchants && mall.merchants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mall.merchants.map((merchant) => (
              <Link
                key={merchant.id}
                href={`/store/${merchant.id}`}
                className="group bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-primary/5 border border-transparent hover:border-primary/10 transition-all duration-500 flex flex-col"
              >
                <div className="relative h-48 w-full mb-6 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                  {merchant.logo ? (
                    <Image
                      src={merchant.logo}
                      alt={merchant.storeName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <ShoppingBag className="w-12 h-12 text-gray-200 group-hover:text-primary transition-colors duration-500" />
                  )}
                  
                  {/* Hover Tag */}
                  <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-primary text-white p-2 rounded-xl shadow-lg">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">
                  {merchant.storeName}
                </h3>
                <p className="text-gray-400 text-xs font-medium leading-relaxed line-clamp-2 mb-6 italic">
                  {merchant.description || "Discover the latest styles and exclusive collections from our premium store."}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">View Store</span>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-300">No stores linked to this mall yet.</h3>
            <p className="text-gray-400 mt-2 italic">Be the first to open your digital doors here!</p>
            <Link 
              href="/merchant/signup" 
              className="mt-8 inline-block bg-primary text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-hover shadow-xl shadow-primary/20"
            >
              Partner with Us
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
