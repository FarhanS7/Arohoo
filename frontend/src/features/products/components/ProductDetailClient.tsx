"use client";

import { useCart } from "@/features/cart/hooks/useCart";
import { Product, ProductVariant } from "@/lib/api/products";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [mainImage, setMainImage] = useState<string | null>(
    product.images.length > 0 ? product.images[0].url : '/placeholder-product.png'
  );

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAddingToCart(true);
    try {
      await addItem(selectedVariant.id, 1);
      router.push('/cart');
    } catch (err: any) {
      alert(err.message || 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const images = product.images.length > 0 ? product.images : [{ url: '/placeholder-product.png', order: 0 }];

  return (
    <div className="bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
               <Image 
                 src={mainImage!}
                 alt={product.name}
                 fill
                 priority
                 className="object-cover object-center transition-all duration-700 hover:scale-110"
                 sizes="(max-width: 768px) 100vw, 50vw"
               />
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(img.url)}
                    className={`relative flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img.url ? 'border-purple-600 ring-2 ring-purple-50 shadow-lg scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <Image 
                      src={img.url} 
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
 
          {/* Product Info */}
          <div className="flex flex-col">
            <div className="border-b border-gray-100 pb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-widest block italic">New Arrival</span>
                {product.merchant && (
                  <Link 
                    href={`/merchants/${product.merchant.id}`}
                    className="flex items-center gap-2 group/brand"
                  >
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-black border border-gray-100 group-hover/brand:border-purple-600 transition-colors">
                      {product.merchant.logo ? (
                        <Image src={product.merchant.logo} alt={product.merchant.storeName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-white">{product.merchant.storeName.substring(0, 1)}</div>
                      )}
                    </div>
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest group-hover/brand:text-purple-600 transition-colors border-b border-transparent group-hover/brand:border-purple-600/30 pb-0.5">
                      {product.merchant.storeName}
                    </span>
                  </Link>
                )}
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight uppercase leading-none mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-black text-gray-900 leading-none">
                ৳{(selectedVariant?.price || product.basePrice).toLocaleString()}
              </p>
            </div>
 
            <div className="py-8 space-y-8">
              <div className="prose prose-sm text-gray-500 font-medium leading-relaxed">
                {product.description || "A masterfully crafted essential designed for comfort and longevity. Made from premium, planet-friendly materials."}
              </div>
 
              {/* Variant Selectors */}
              <div className="space-y-6">
                <div>
                   <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Select Size</h3>
                   <div className="flex flex-wrap gap-3">
                     {product.variants.map((v) => (
                       <button
                         key={v.id}
                         onClick={() => setSelectedVariant(v)}
                         className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all ${selectedVariant?.id === v.id ? 'bg-purple-600 border-purple-600 text-white shadow-xl -translate-y-1' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300'}`}
                       >
                         {v.size} {v.color && `- ${v.color}`}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
 
              <div className="pt-4 flex flex-col gap-4">
                <button 
                  disabled={addingToCart || !selectedVariant || selectedVariant.stock === 0}
                  onClick={handleAddToCart}
                  className="w-full py-5 bg-purple-600 text-white font-bold rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-purple-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {addingToCart ? "Adding..." : selectedVariant?.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  {!addingToCart && selectedVariant?.stock !== 0 && (
                    <>
                      <span className="opacity-40 text-sm">/</span>
                      <span className="opacity-90">Bag</span>
                    </>
                  )}
                </button>
                
                {product.merchant && (
                  <Link 
                    href={`/merchants/${product.merchant.id}`}
                    className="w-full py-4 border-2 border-neutral-100 text-center text-[10px] font-black uppercase tracking-widest text-neutral-400 rounded-2xl hover:bg-neutral-50 hover:border-neutral-200 hover:text-neutral-900 transition-all shadow-sm"
                  >
                    Visit {product.merchant.storeName} Store
                  </Link>
                )}

                <div className="flex items-center justify-center gap-6 text-[10px] uppercase font-bold text-gray-400 tracking-widest pt-2">
                   <div className="flex items-center gap-2">
                     <span className="w-1 h-1 rounded-full bg-green-500"></span>
                     In Stock
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 border border-purple-400 rounded-full"></span>
                     Ships Worldwide
                   </div>
                </div>
              </div>
            </div>
 
            {/* Product Meta (Simplified) */}
            <div className="mt-auto border-t border-gray-100 pt-8 grid grid-cols-2 gap-8">
               <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">SKU</h4>
                  <p className="text-xs font-bold text-gray-700">{selectedVariant?.sku || '--'}</p>
               </div>
               <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Category</h4>
                  <p className="text-xs font-bold text-gray-700 underline underline-offset-4 decoration-purple-200">Sustainability</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section (Mock) */}
      <div className="bg-gray-50 py-24 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight mb-12 italic">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="aspect-[4/5] bg-gray-200 rounded-2xl" />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
