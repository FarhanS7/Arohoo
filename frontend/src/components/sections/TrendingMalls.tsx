import Image from "next/image";
import Link from "next/link";
import { mallService, Mall } from "@/lib/api/mall";
import { unstable_cache } from "next/cache";

export const getCachedMalls = unstable_cache(
  async () => mallService.getAllMalls(),
  ["all-malls"],
  { revalidate: 60, tags: ["malls"] }
);

export default async function TrendingMalls() {
  let malls: Mall[] = [];
  try {
    const res = await getCachedMalls();
    if (res.status === "success") {
      malls = res.data.slice(0, 4); // Show top 4 on landing page
    }
  } catch (error) {
    console.error("Failed to fetch malls on server:", error);
    return null;
  }

  if (malls.length === 0) return null;

  return (
    <section className="fluid-py bg-muted/30">
      <div className="responsive-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-5 gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-neutral-900 mb-1 tracking-tighter uppercase italic">Trending Malls</h2>
            <p className="text-neutral-500 text-[10px] sm:text-sm font-medium tracking-tight">Virtual access to the most popular shopping destinations.</p>
          </div>
          <Link href="/malls" className="text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 border-b-2 border-primary/20 pb-1 w-fit hidden sm:block">
            See All Malls
          </Link>
        </div>

        <div className="flex sm:grid flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 gap-4 sm:gap-8 no-scrollbar grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 snap-x snap-mandatory">
          {malls.map((mall) => (
            <Link
              href={`/malls/${mall.id}`}
              key={mall.id}
              className="group relative flex-shrink-0 min-w-[280px] sm:min-w-0 aspect-[16/10] sm:aspect-square lg:aspect-[16/10] overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-md border border-neutral-100 block snap-start"
            >
              {mall.coverImage ? (
                <Image
                  src={mall.coverImage}
                  alt={mall.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-300 font-black text-xs sm:text-xl italic opacity-20 uppercase tracking-tighter">Mall</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-3 sm:p-6 text-white">
                <p className="text-[6px] sm:text-[9px] font-black text-primary border border-primary/30 w-fit px-2 py-0.5 rounded-full mb-1 sm:mb-2 tracking-[0.1em] uppercase bg-primary/10 backdrop-blur-sm">
                  {mall.location}
                </p>
                <h3 className="text-xs sm:text-xl font-black mb-1 leading-none uppercase italic tracking-tighter truncate">{mall.name}</h3>
                <p className="text-white/60 text-[8px] sm:text-[10px] font-medium mb-2 sm:mb-4 line-clamp-1">{mall.description}</p>
                
                <div className="w-full bg-white text-primary px-2 py-1.5 rounded-md sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-center shadow-md group-hover:bg-primary group-hover:text-white transition-colors">
                  Visit Mall
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 flex justify-center sm:hidden">
            <Link href="/malls" className="text-[8px] font-black uppercase tracking-[0.2em] bg-neutral-900 text-white py-3 px-6 rounded-full inline-block shadow-lg shadow-neutral-200">See All Malls</Link>
        </div>
      </div>
    </section>
  );
}
