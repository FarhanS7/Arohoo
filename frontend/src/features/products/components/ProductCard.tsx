"use client";

import { Product } from "@/lib/api/products";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const mainImage = product.images.length > 0 ? product.images[0].url : null;
  const displayImage = mainImage || '/placeholder-product.png';

  const merchantLogo = product.merchant?.logo || null;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          priority={priority}
          className="object-cover object-center"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white px-3 py-1.5 rounded-lg inline-block shadow-sm">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block leading-none mb-1">From</span>
              <span className="text-sm font-extrabold text-gray-900 leading-none">৳{Number(product.basePrice).toLocaleString()}</span>
            </div>
          </div>
        {product.merchant && (
          <Link 
            href={`/merchants/${product.merchant.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 left-4 flex items-center gap-2 bg-white p-1.5 pr-4 rounded-full shadow-lg border border-white"
          >
            <div className="relative w-7 h-7 rounded-full bg-black text-white flex items-center justify-center overflow-hidden border border-neutral-100">
              {merchantLogo ? (
                <Image src={merchantLogo} alt={product.merchant.storeName} fill className="object-cover" />
              ) : (
                <span className="text-[10px] font-black">{product.merchant.storeName.substring(0, 1)}</span>
              )}
            </div>
            <span className="text-[10px] font-black text-neutral-900 uppercase tracking-widest hidden sm:block">
              {product.merchant.storeName}
            </span>
          </Link>
        )}
      </div>
      <div className="mt-4 px-1">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-gray-500 font-medium line-clamp-1">
          {product.description || 'Premium sustainable essential'}
        </p>
      </div>
    </Link>
  );
}
