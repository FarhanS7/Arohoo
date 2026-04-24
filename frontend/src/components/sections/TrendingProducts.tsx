import { Product, productService } from "@/lib/api/products";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";

export const getCachedTrendingProducts = unstable_cache(
  async () => productService.getTrendingProducts(10),
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
    }
  } catch (error) {
    console.error("[TrendingProducts] Failed to fetch trending products:", error);
    return null;
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="py-4 sm:py-6 bg-white">
      <div className="responsive-container">
        {/* Centered Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-sm sm:text-lg font-bold text-neutral-800 uppercase tracking-[0.3em] font-sans">
            Trending Products
          </h2>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex overflow-x-auto subtle-scrollbar gap-2 sm:gap-3 pb-4 snap-x snap-mandatory px-4">
          {products.map((product, index) => (
            <Link 
              href={`/products/${product.id}`}
              key={product.id} 
              className="group relative flex-shrink-0 w-32 sm:w-44 flex flex-col bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-500 snap-center overflow-hidden"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-50">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    priority={index === 0}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 128px, 176px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-200 font-bold text-xl italic uppercase font-sans">
                    AROHOO
                  </div>
                )}
                <div className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[5px] sm:text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                  Trending
                </div>
              </div>
              <div className="p-2 sm:p-3 flex flex-col">
                <h3 className="font-bold text-neutral-800 mb-0.5 text-[8px] sm:text-xs line-clamp-1 group-hover:text-primary transition-colors tracking-tight uppercase font-sans">
                  {product.name}
                </h3>
                <span className="text-[10px] sm:text-sm font-bold text-primary font-sans">
                  ৳{Number(product.basePrice).toLocaleString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
