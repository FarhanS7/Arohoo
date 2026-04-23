import Image from "next/image";
import Link from "next/link";
import { getPublicMerchants } from "@/lib/api/merchant";
import { unstable_cache } from "next/cache";

export const getCachedTrendingBrands = unstable_cache(
  async () => getPublicMerchants({ isTrending: true, limit: 12 }),
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
    <section className="py-4 sm:py-6 bg-white">
      <div className="responsive-container">
        {/* Centered Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-sm sm:text-lg font-bold text-neutral-800 uppercase tracking-[0.3em] font-sans">
            Trending Brands
          </h2>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex overflow-x-auto subtle-scrollbar gap-2 sm:gap-4 pb-6 snap-x snap-mandatory px-4">
          {brands.map((brand: any) => (
            <Link
              href={`/merchants/${brand.id}`}
              key={brand.id}
              className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-500 group snap-center"
            >
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 transition-transform duration-700 group-hover:scale-105">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.storeName}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100px, 160px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-neutral-300 text-lg sm:text-3xl tracking-tighter uppercase font-sans">
                    {brand.storeName.substring(0, 2)}
                  </div>
                )}
              </div>
              
              {/* Subtle tooltip style store name on hover (optional, but adds "premium" feel) */}
              <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 group-hover:bottom-[-1.5rem] transition-all duration-300 pointer-events-none">
                <span className="text-[8px] sm:text-[10px] font-bold text-primary uppercase tracking-widest whitespace-nowrap bg-white px-3 py-1 rounded-full shadow-sm border border-primary/10">
                  {brand.storeName}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
