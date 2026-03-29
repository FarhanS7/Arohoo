"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mallService, Mall } from "@/lib/api/mall";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TrendingMalls() {
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMalls() {
      try {
        const res = await mallService.getAllMalls();
        if (res.status === "success") {
          setMalls(res.data.slice(0, 3)); // Only show top 3 on landing page
        }
      } catch (error) {
        console.error("Failed to fetch malls:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMalls();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
               <Skeleton className="h-10 w-48" />
               <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] w-full rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (malls.length === 0) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Trending Malls</h2>
            <p className="text-gray-500 font-medium">Virtual access to the most popular shopping destinations.</p>
          </div>
          <Link href="/malls" className="text-primary font-black text-sm uppercase tracking-widest hover:opacity-70 transition-all">
            See All Malls
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {malls.map((mall) => (
            <div
              key={mall.id}
              className="group relative h-[450px] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-gray-200/50 hover:shadow-primary/10 transition-all duration-700"
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
                  <span className="text-gray-300 font-black text-4xl italic opacity-20">Mall</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-10 text-white">
                <p className="text-[10px] font-black text-primary border border-primary/30 w-fit px-3 py-1 rounded-full mb-3 tracking-[0.2em] uppercase bg-primary/10 backdrop-blur-sm">
                  {mall.location}
                </p>
                <h3 className="text-3xl font-black mb-1 leading-tight">{mall.name}</h3>
                <p className="text-white/60 text-xs font-medium mb-6 line-clamp-2">{mall.description}</p>
                
                <Link 
                  href={`/malls/${mall.id}`}
                  className="w-full bg-white text-primary px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl shadow-white/10"
                >
                  Visit Mall
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
