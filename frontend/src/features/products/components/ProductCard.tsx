"use client";

import { Product } from "@/lib/api/products";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.length > 0 ? product.images[0].url : null;
  const displayImage = mainImage 
    ? (mainImage.startsWith('http') ? mainImage : `http://localhost:8000${mainImage}`)
    : '/placeholder-product.png';

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <img
          src={displayImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.variants.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg inline-block shadow-sm">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block leading-none mb-1">From</span>
              <span className="text-sm font-extrabold text-gray-900 leading-none">${product.basePrice}</span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 px-1">
        <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-gray-500 font-medium line-clamp-1">
          {product.description || 'Premium sustainable essential'}
        </p>
      </div>
    </Link>
  );
}
