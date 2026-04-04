import Image from "next/image";
import Link from "next/link";
import { getPublicMerchants } from "@/lib/api/merchant";

export default async function TrendingBrands() {
  let brands: any[] = [];
  try {
    const res = await getPublicMerchants({ isTrending: true, limit: 6 });
    if (res.success && Array.isArray(res.data)) {
      brands = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch trending brands on server:", error);
    return null;
  }

  if (!brands || brands.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 mb-2 tracking-tight uppercase italic">Trending Brands</h2>
            <p className="text-neutral-500 font-medium tracking-tight">The most influential brand boutiques curated for you.</p>
          </div>
          <Link href="/brands" className="text-primary font-black text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-all border-b-2 border-primary/20 pb-1">
            Explore All Brands
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {brands.map((brand: any) => (
            <Link
              href={`/merchants/${brand.id}`}
              key={brand.id}
              className="relative h-40 flex flex-col items-center justify-center p-6 bg-white border border-neutral-100 rounded-[2.5rem] shadow-sm"
            >
              <div className="relative w-full h-16 mb-4 transition-all duration-700">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.storeName}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-neutral-300 text-xl tracking-tighter italic">
                    {brand.storeName.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-black text-neutral-900 uppercase tracking-[0.2em] text-center truncate w-full px-2">
                {brand.storeName}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
