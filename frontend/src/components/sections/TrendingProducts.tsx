"use client";

import Image from "next/image";

const products = [
  { id: 1, name: "Purple Fusion Sneakers", category: "Shoes", price: "৳4,500", image: "/images/product_1.png" },
  { id: 2, name: "Regal Leather Tote", category: "Bags", price: "৳8,200", image: "/images/product_2.png" },
  { id: 3, name: "Lavender Air Sneakers", category: "Shoes", price: "৳5,100", image: "/images/product_1.png" },
  { id: 4, name: "Minimalist Purple Satchel", category: "Bags", price: "৳6,500", image: "/images/product_2.png" },
];

export default function TrendingProducts() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Products</h2>
            <p className="text-gray-500">The most sought-after items this week.</p>
          </div>
          <button className="text-primary font-semibold hover:underline">View All Products</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
              <div className="relative h-80 w-full overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-primary hover:text-white backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                </button>
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  Trending
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">{product.category}</p>
                <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{product.price}</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
