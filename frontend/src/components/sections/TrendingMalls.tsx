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
      malls = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch malls on server:", error);
    return null;
  }

  if (malls.length === 0) return null;

  return (
    <section className="py-4 sm:py-6 bg-neutral-50/50">
      <div className="responsive-container">
        {/* Centered Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-sm sm:text-lg font-bold text-neutral-800 uppercase tracking-[0.3em] font-sans">
            Trending Malls
          </h2>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex overflow-x-auto subtle-scrollbar gap-2 sm:gap-4 pb-6 snap-x snap-mandatory px-4">
          {malls.map((mall) => (
            <Link
              href={`/malls/${mall.id}`}
              key={mall.id}
              className="group relative flex-shrink-0 w-56 sm:w-80 aspect-[16/9] overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-500 snap-center block"
            >
              {mall.coverImage ? (
                <Image
                  src={mall.coverImage}
                  alt={mall.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 224px, 320px"
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
                  <span className="text-neutral-300 font-bold text-xs uppercase tracking-tighter font-sans">Mall</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 sm:p-5 text-white">
                <p className="text-[6px] sm:text-[8px] font-bold text-primary border border-primary/30 w-fit px-2 py-0.5 rounded-full mb-1 tracking-widest uppercase bg-primary/10 backdrop-blur-sm font-sans">
                  {mall.location}
                </p>
                <h3 className="text-xs sm:text-base font-bold uppercase tracking-tight truncate font-sans">{mall.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
