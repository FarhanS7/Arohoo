import Image from "next/image";
import Link from "next/link";
import { mallService, Mall } from "@/lib/api/mall";

export default async function TrendingMalls() {
  let malls: Mall[] = [];
  try {
    const res = await mallService.getAllMalls();
    if (res.status === "success") {
      malls = res.data.slice(0, 4); // Show top 4 on landing page
    }
  } catch (error) {
    console.error("Failed to fetch malls on server:", error);
    return null;
  }

  if (malls.length === 0) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Trending Malls</h2>
            <p className="text-gray-500 font-medium tracking-tight">Virtual access to the most popular shopping destinations.</p>
          </div>
          <Link href="/malls" className="text-primary font-black text-sm uppercase tracking-widest hover:opacity-70 transition-all">
            See All Malls
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {malls.map((mall) => (
            <Link
              href={`/malls/${mall.id}`}
              key={mall.id}
              className="group relative h-[220px] sm:h-[280px] overflow-hidden rounded-xl sm:rounded-3xl bg-white shadow-md border border-neutral-100 block"
            >
              {mall.coverImage ? (
                <Image
                  src={mall.coverImage}
                  alt={mall.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-300 font-black text-xl italic opacity-20 uppercase tracking-tighter">Mall</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                <p className="text-[7px] sm:text-[9px] font-black text-primary border border-primary/30 w-fit px-2 py-0.5 rounded-full mb-1 sm:mb-2 tracking-[0.1em] uppercase bg-primary/10 backdrop-blur-sm">
                  {mall.location}
                </p>
                <h3 className="text-sm sm:text-xl font-black mb-1 leading-none uppercase italic tracking-tighter truncate">{mall.name}</h3>
                <p className="text-white/60 text-[9px] sm:text-[10px] font-medium mb-3 sm:mb-4 line-clamp-1">{mall.description}</p>
                
                <div className="w-full bg-white text-primary px-3 py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center shadow-md">
                  Visit Mall
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
