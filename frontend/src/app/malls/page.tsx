"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mallService, Mall } from "@/lib/api/mall";
import Navbar from "@/components/layout/Navbar";
import { Skeleton } from "@/components/ui/Skeleton";
import { MapPin, ArrowRight, Store } from "lucide-react";

export default function MallsPage() {
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMalls() {
      try {
        const res = await mallService.getAllMalls();
        if (res.status === "success") {
          setMalls(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch malls:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMalls();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 selection:bg-primary/20">
      <Navbar />
      
      {/* Hero Header */}
      <section className="bg-[#1a0b2e] py-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">Shopping Destinations</h1>
          <p className="max-w-2xl mx-auto text-white/60 text-lg font-medium">
            Explore premium malls and their curated stores. Bringing the best of physical shopping to your screen.
          </p>
        </div>
        
        {/* Decors */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -ml-32 -mb-32" />
      </section>

      <main className="max-w-7xl mx-auto px-4 py-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[450px] w-full rounded-[2.5rem]" />
            ))}
          </div>
        ) : malls.length === 0 ? (
          <div className="text-center py-40">
            <h2 className="text-2xl font-black text-gray-300">No malls found yet.</h2>
            <p className="text-gray-400 mt-2">Check back later for new destinations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {malls.map((mall) => (
              <Link 
                key={mall.id} 
                href={`/malls/${mall.id}`}
                className="group relative h-[450px] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-gray-200/50 hover:shadow-primary/20 transition-all duration-700 block"
              >
                {mall.coverImage ? (
                  <Image
                    src={mall.coverImage}
                    alt={mall.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-300 font-black text-4xl italic opacity-20">Destination</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-10 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <MapPin className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                      {mall.location}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-black mb-1 leading-tight">{mall.name}</h3>
                  <p className="text-white/60 text-xs font-medium mb-6 line-clamp-2">{mall.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
                    <div className="flex items-center gap-2">
                       <Store className="w-4 h-4 text-primary" />
                       <span className="text-xs font-black uppercase tracking-widest text-white/90">
                        {mall._count?.merchants || 0} Stores
                       </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer Call to Action */}
      <section className="bg-white border-t border-gray-100 py-24">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Own a Store in one of these Malls?</h2>
            <p className="text-gray-500 font-medium mb-10 italic">Join our premium digital ecosystem and reach thousands of daily visitors.</p>
            <Link 
              href="/merchant/signup"
              className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary-hover shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1"
            >
              Start Selling Today
              <ArrowRight className="w-5 h-5" />
            </Link>
         </div>
      </section>
    </div>
  );
}
