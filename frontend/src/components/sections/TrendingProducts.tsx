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
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-6 px-4">
          {products.map((product, index) => (
            <Link 
              href={`/products/${product.id}`}
              key={product.id} 
              className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-neutral-100"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-50/50">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    priority={index < 4}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-200 font-bold text-xl italic uppercase font-sans">
                    AROHOO
                  </div>
                )}
                {/* Visual Accent */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4 flex flex-col bg-white">
                <h3 className="font-bold text-neutral-800 mb-1.5 text-xs sm:text-sm line-clamp-2 group-hover:text-primary transition-colors tracking-tight uppercase font-sans leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm sm:text-base font-black text-primary font-sans">
                    ৳{Number(product.basePrice).toLocaleString()}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary scale-0 group-hover:scale-100 transition-transform">
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
