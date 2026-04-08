import Image from "next/image";
import Link from "next/link";
import { productService, Product } from "@/lib/api/products";
import { unstable_cache } from "next/cache";

export const getCachedTrendingProducts = unstable_cache(
  async () => productService.getTrendingProducts(4),
  ["trending-products"],
  { revalidate: 60, tags: ["products", "trending"] }
);

export default async function TrendingProducts() {
  let products: Product[] = [];
  try {
    const res = await getCachedTrendingProducts();
    if (Array.isArray(res)) {
      products = res;
    } else if (res && res.success && Array.isArray(res.data)) {
      products = res.data;
    } else {
      console.error("[TrendingProducts] API returned unsuccessful or unrecognized response:", res);
    }
  } catch (error) {
    console.error("[TrendingProducts] Failed to fetch trending products on server:", error instanceof Error ? error.message : error);
    return null;
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="fluid-py bg-white">
      <div className="responsive-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-5 gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-neutral-900 mb-1 tracking-tighter uppercase italic">Trending Selection</h2>
            <p className="text-neutral-500 text-[10px] sm:text-sm font-medium tracking-tight">Handpicked premium items trending across the platform.</p>
          </div>
          <Link href="/shop" className="text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 border-b-2 border-primary/20 pb-1 w-fit hidden sm:block">
            Explore All
          </Link>
        </div>

        <div className="flex sm:grid flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 gap-3 sm:gap-6 no-scrollbar grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 snap-x snap-mandatory hover:[&_a]:z-10">
          {products.map((product, index) => (
            <Link 
              href={`/products/${product.id}`}
              key={product.id} 
              className="group flex-shrink-0 min-w-[160px] sm:min-w-0 overflow-hidden rounded-xl sm:rounded-[2rem] bg-white border border-neutral-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col snap-start"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-50">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    priority={index === 0}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 160px, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-200 font-black text-xl sm:text-4xl italic">
                    AROHOO
                  </div>
                )}
                <div className="absolute top-1.5 left-1.5 sm:top-5 sm:left-5 bg-black/80 text-white text-[6px] sm:text-[10px] font-black uppercase tracking-widest px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                  Trending
                </div>
              </div>
              <div className="p-2 sm:p-7 flex flex-col flex-1">
                <h3 className="font-black text-neutral-900 mb-0.5 sm:mb-2 text-[8px] sm:text-lg line-clamp-1 group-hover:text-primary transition-colors tracking-tight uppercase italic">{product.name}</h3>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[10px] sm:text-xl font-black text-primary">৳{Number(product.basePrice).toLocaleString()}</span>
                  <div className="w-5 h-5 sm:w-10 sm:h-10 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 flex justify-center sm:hidden">
            <Link href="/shop" className="text-[8px] font-black uppercase tracking-[0.2em] bg-neutral-900 text-white py-3 px-6 rounded-full inline-block shadow-lg shadow-neutral-200">View All Selections</Link>
        </div>
      </div>
    </section>
  );
}
