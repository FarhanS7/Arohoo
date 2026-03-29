"use client";

import Image from "next/image";

const brands = [
  { name: "Brand One", logo: "/images/brand_logos.png" },
  { name: "Brand Two", logo: "/images/brand_logos.png" },
  { name: "Brand Three", logo: "/images/brand_logos.png" },
  { name: "Brand Four", logo: "/images/brand_logos.png" },
  { name: "Brand Five", logo: "/images/brand_logos.png" },
  { name: "Brand Six", logo: "/images/brand_logos.png" },
];

export default function TrendingBrands() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Brands</h2>
            <p className="text-gray-500">Shop your favorites from top global and local brands.</p>
          </div>
          <button className="text-primary font-semibold hover:underline">View All Brands</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="group relative h-32 flex items-center justify-center p-8 bg-muted hover:bg-white border-2 border-transparent hover:border-primary/20 rounded-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
