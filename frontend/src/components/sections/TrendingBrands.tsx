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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-neutral-900 mb-2 tracking-tighter uppercase italic">Trending Brands</h2>
            <p className="text-neutral-500 text-xs sm:text-base font-medium tracking-tight">The most influential brand boutiques curated for you.</p>
          </div>
          <Link href="/brands" className="text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 border-b-2 border-primary/20 pb-1 w-fit hidden sm:block">
            Explore All Brands
          </Link>
        </div>

        <div className="responsive-grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand: any) => (
            <Link
              href={`/merchants/${brand.id}`}
              key={brand.id}
              className="relative aspect-square sm:aspect-[4/5] lg:aspect-square flex flex-col items-center justify-center p-4 sm:p-6 bg-white border border-neutral-100 rounded-3xl sm:rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/10 transition-all duration-500 group"
            >
              <div className="relative w-full h-12 sm:h-16 mb-2 sm:mb-4 transition-all duration-700 group-hover:scale-110">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.storeName}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-neutral-300 text-lg sm:text-xl tracking-tighter italic">
                    {brand.storeName.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-neutral-900 uppercase tracking-[0.1em] sm:tracking-[0.2em] text-center truncate w-full px-2 group-hover:text-primary transition-colors">
                {brand.storeName}
              </span>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
            <Link href="/brands" className="text-[10px] font-black uppercase tracking-[0.2em] bg-neutral-900 text-white py-5 px-8 rounded-2xl block shadow-xl shadow-neutral-200">Explore All Brands</Link>
        </div>
      </div>
    </section>
  );
}
