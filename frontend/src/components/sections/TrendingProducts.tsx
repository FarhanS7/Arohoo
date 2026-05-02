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

        {/* Product Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5 sm:gap-3 px-2 sm:px-4">
          {products.map((product, index) => (
            <Link 
              href={`/products/${product.id}`}
              key={product.id} 
              className="group relative flex flex-col bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-50/50">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    priority={index === 0}
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 25vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-200 font-bold text-[10px] sm:text-xl italic uppercase font-sans">
                    AROHOO
                  </div>
                )}
              </div>
              <div className="p-1.5 sm:p-2.5 flex flex-col bg-white">
                <h3 className="font-bold text-neutral-800 mb-1 text-[8px] sm:text-xs line-clamp-2 group-hover:text-primary transition-colors tracking-tight uppercase font-sans leading-[1.3]">
                  {product.name}
                </h3>
                <span className="text-[10px] sm:text-[13px] font-black text-primary font-sans">
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
