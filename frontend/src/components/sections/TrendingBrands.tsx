import Image from "next/image";
import Link from "next/link";
import { getPublicMerchants } from "@/lib/api/merchant";
import { unstable_cache } from "next/cache";

export const getCachedTrendingBrands = unstable_cache(
  async () => getPublicMerchants({ isTrending: true, limit: 6 }),
  ["trending-brands"],
  { revalidate: 60, tags: ["merchants", "trending"] }
);

export default async function TrendingBrands() {
  let brands: any[] = [];
  try {
    const res = await getCachedTrendingBrands();
    if (res.success && Array.isArray(res.data)) {
      brands = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch trending brands on server:", error);
    return null;
  }

  if (!brands || brands.length === 0) return null;

  return (
    <section className="fluid-py bg-white">
      <div className="responsive-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-5 gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-neutral-900 mb-1 tracking-tighter uppercase italic">Trending Brands</h2>
            <p className="text-neutral-500 text-[10px] sm:text-sm font-medium tracking-tight">The most influential brand boutiques curated for you.</p>
          </div>
          <Link href="/brands" className="text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 border-b-2 border-primary/20 pb-1 w-fit hidden sm:block">
            Explore All Brands
          </Link>
        </div>

        <div className="flex sm:grid flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 gap-3 sm:gap-6 no-scrollbar grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 snap-x snap-mandatory">
          {brands.map((brand: any) => (
            <Link
              href={`/merchants/${brand.id}`}
              key={brand.id}
              className="relative flex-shrink-0 min-w-[120px] sm:min-w-0 aspect-square sm:aspect-[4/5] lg:aspect-square flex flex-col items-center justify-center p-3 sm:p-6 bg-white border border-neutral-100 rounded-2xl sm:rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/10 transition-all duration-500 group snap-start"
            >
              <div className="relative w-full h-20 sm:h-32 mb-1.5 sm:mb-4 transition-all duration-700 group-hover:scale-110">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.storeName}
                    fill
                    className="object-contain drop-shadow-sm"
                    sizes="(max-width: 640px) 120px, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-neutral-300 text-2xl sm:text-4xl tracking-tighter italic">
                    {brand.storeName.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-[7px] sm:text-[10px] font-black text-neutral-900 uppercase tracking-[0.1em] sm:tracking-[0.2em] text-center truncate w-full px-1 group-hover:text-primary transition-colors">
                {brand.storeName}
              </span>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 flex justify-center sm:hidden">
            <Link href="/brands" className="text-[8px] font-black uppercase tracking-[0.2em] bg-neutral-900 text-white py-3 px-6 rounded-full inline-block shadow-lg shadow-neutral-200">Explore All Brands</Link>
        </div>
      </div>
    </section>
  );
}
