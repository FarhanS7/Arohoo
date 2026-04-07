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
    if (res.success && Array.isArray(res.data)) {
      products = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch trending products on server:", error);
    return null;
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="fluid-py bg-white">
      <div className="responsive-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-neutral-900 mb-2 tracking-tighter uppercase italic">Trending Selection</h2>
            <p className="text-neutral-500 text-xs sm:text-base font-medium tracking-tight">Handpicked premium items trending across the platform.</p>
          </div>
          <Link href="/shop" className="text-primary font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 border-b-2 border-primary/20 pb-1 w-fit hidden sm:block">
            Explore All
          </Link>
        </div>

        <div className="responsive-grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 hover:[&_a]:z-10">
          {products.map((product, index) => (
            <Link 
              href={`/products/${product.id}`}
              key={product.id} 
              className="group overflow-hidden rounded-2xl sm:rounded-[2rem] bg-white border border-neutral-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden bg-neutral-50">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    priority={index === 0}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-200 font-black text-2xl sm:text-4xl italic">
                    AROHOO
                  </div>
                )}
                <div className="absolute top-2 left-2 sm:top-5 sm:left-5 bg-black/80 text-white text-[7px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                  Trending
                </div>
              </div>
              <div className="p-3 sm:p-7 flex flex-col flex-1">
                <h3 className="font-black text-neutral-900 mb-1 sm:mb-2 text-[10px] sm:text-lg line-clamp-1 group-hover:text-primary transition-colors tracking-tight uppercase italic">{product.name}</h3>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs sm:text-xl font-black text-primary">৳{Number(product.basePrice).toLocaleString()}</span>
                  <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
            <Link href="/shop" className="text-[10px] font-black uppercase tracking-[0.2em] bg-neutral-900 text-white py-5 px-8 rounded-2xl block shadow-xl shadow-neutral-200">View All Selections</Link>
        </div>
      </div>
    </section>
  );
}
