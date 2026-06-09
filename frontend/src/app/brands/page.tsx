import PageLayout from "@/components/layout/UX/PageLayout";
import { getPublicMerchants } from "@/lib/api/merchant";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const getCachedBrands = unstable_cache(
  async () => getPublicMerchants({ limit: 100 }),
  ["all-brands"],
  { revalidate: 300, tags: ["merchants"] }
);

export const metadata = {
  title: "Explore Premium Brands | Arohoo Marketplace",
  description: "Browse our hand-curated selection of boutique brands and merchants.",
};

export default async function BrandsPage() {
  let brands: any[] = [];
  try {
    const res = await getCachedBrands();
    if (res.success && Array.isArray(res.data)) {
      brands = res.data.filter((b: any) => b.isApproved !== false);
    }
  } catch (error) {
    console.error("Failed to load brands:", error);
  }

  return (
    <PageLayout>
      <div className="bg-neutral-50/50 min-h-screen py-16 sm:py-24">
        <div className="responsive-container">
          
          {/* Header Section */}
          <div className="max-w-2xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Curated Merchants
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tighter uppercase italic mb-4">
              Explore Our Brands
            </h1>
            <p className="text-neutral-500 text-sm font-medium leading-relaxed italic">
              Discover unique styles and boutique items directly from independent fashion houses, designer collectives, and premium labels.
            </p>
          </div>

          {brands.length === 0 ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-neutral-100 shadow-sm p-12 text-center">
              <h3 className="text-lg font-bold text-neutral-800 uppercase tracking-widest mb-2">No Brands Available</h3>
              <p className="text-neutral-500 text-xs italic">We are currently onboarding new premium merchants. Check back soon!</p>
            </div>
          ) : (
            /* Brands Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {brands.map((brand) => (
                <Link
                  href={`/merchants/${brand.slug}`}
                  key={brand.id}
                  className="group bg-white rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-500 p-8 flex flex-col h-full active:scale-98"
                >
                  {/* Brand Logo Container */}
                  <div className="relative w-full aspect-square bg-neutral-50 rounded-2xl flex items-center justify-center overflow-hidden mb-6 border border-neutral-100 group-hover:bg-white transition-colors duration-500">
                    <div className="relative w-3/4 h-3/4 transition-transform duration-700 group-hover:scale-108">
                      {brand.logo ? (
                        <Image
                          src={brand.logo}
                          alt={brand.storeName}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 150px, 250px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-neutral-300 text-4xl tracking-tighter uppercase font-sans">
                          {brand.storeName.substring(0, 2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Brand Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-black text-neutral-900 uppercase tracking-tight group-hover:text-primary transition-colors mb-2">
                        {brand.storeName}
                      </h3>
                      <p className="text-neutral-500 text-xs font-medium leading-relaxed italic line-clamp-2 mb-6">
                        {brand.description || "Premium independent merchant on the Arohoo Marketplace."}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-900 group-hover:text-primary transition-colors">
                      View Collection
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </PageLayout>
  );
}
