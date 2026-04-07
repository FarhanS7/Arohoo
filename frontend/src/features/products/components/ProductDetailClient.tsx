"use client";

import { useCart } from "@/features/cart/hooks/useCart";
import { Product, ProductVariant } from "@/lib/api/products";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToastContext } from "@/components/providers/ToastProvider";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { addToast } = useToastContext();
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
      addToast("success", "Added to bag");
      router.push('/cart');
    } catch (err: any) {
      addToast("error", err.message || 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const images = product.images.length > 0 ? product.images : [{ url: '/placeholder-product.png', order: 0 }];

  return (
    <div className="bg-white font-sans overflow-hidden">
      <div className="responsive-container py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-neutral-50 shadow-sm border border-neutral-100">
               <Image 
                 src={mainImage || '/placeholder-product.png'}
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
                    className={`relative flex-shrink-0 w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img.url ? 'border-primary border-4 shadow-xl scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
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
            <div className="border-b border-neutral-100 pb-10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">New Arrival</span>
                {product.merchant && (
                  <Link 
                    href={`/merchants/${product.merchant.id}`}
                    className="flex items-center gap-2 group/brand"
                  >
                    <div className="relative w-8 h-8 rounded-2xl overflow-hidden bg-black border border-neutral-100 group-hover/brand:border-primary transition-all">
                      {product.merchant.logo ? (
                        <Image src={product.merchant.logo} alt={product.merchant.storeName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-white italic">{product.merchant.storeName.substring(0, 1)}</div>
                      )}
                    </div>
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest group-hover/brand:text-primary transition-colors border-b border-transparent group-hover/brand:border-primary/20 pb-0.5">
                      {product.merchant.storeName}
                    </span>
                  </Link>
                )}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-neutral-900 tracking-tighter uppercase leading-none mb-6 italic animate-in slide-in-from-bottom-4 duration-700">
                {product.name}
              </h1>
              <p className="text-3xl font-black text-neutral-900 leading-none tracking-tighter italic">
                ৳{(selectedVariant?.price || product.basePrice).toLocaleString()}
              </p>
            </div>
 
            <div className="py-10 space-y-10">
              <div className="prose prose-neutral text-neutral-500 font-medium leading-relaxed italic text-base">
                {product.description || "A masterfully crafted essential designed for comfort and longevity. Made from premium, planet-friendly materials."}
              </div>
 
              {/* Variant Selectors */}
              <div className="space-y-8">
                <div>
                   <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-6">Select Size</h3>
                   <div className="flex flex-wrap gap-4">
                     {product.variants.map((v) => (
                       <button
                         key={v.id}
                         onClick={() => setSelectedVariant(v)}
                         className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedVariant?.id === v.id ? 'bg-primary border-primary text-white shadow-2xl -translate-y-1' : 'bg-white border-neutral-100 text-neutral-500 hover:border-neutral-200'}`}
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
                  className="w-full py-6 bg-primary text-white font-black rounded-[2rem] text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                >
                  {addingToCart ? "Adding..." : selectedVariant?.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  {!addingToCart && (selectedVariant?.stock ?? 0) !== 0 && (
                    <>
                      <span className="opacity-20 text-lg font-thin">|</span>
                      <span className="opacity-90">Bag</span>
                    </>
                  )}
                </button>
                
                {product.merchant && (
                  <Link 
                    href={`/merchants/${product.merchant.id}`}
                    className="w-full py-5 border-2 border-neutral-100 text-center text-[10px] font-black uppercase tracking-widest text-neutral-400 rounded-2xl hover:bg-neutral-50 hover:border-neutral-200 hover:text-neutral-900 transition-all shadow-sm"
                  >
                    Visit {product.merchant.storeName} Store
                  </Link>
                )}
 
                <div className="flex items-center justify-center gap-8 text-[10px] uppercase font-black text-neutral-300 tracking-[0.2em] pt-4 italic">
                   <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                     In Stock
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 border-2 border-primary/40 rounded-full"></span>
                     Ships Worldwide
                   </div>
                </div>
              </div>
            </div>
 
            {/* Product Meta (Simplified) */}
            <div className="mt-auto border-t border-neutral-100 pt-10 grid grid-cols-2 gap-10">
               <div>
                  <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2 italic">SKU</h4>
                  <p className="text-xs font-black text-neutral-900 italic uppercase tracking-tighter">{selectedVariant?.sku || '--'}</p>
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2 italic">Category</h4>
                  <p className="text-xs font-black text-neutral-900 underline underline-offset-8 decoration-primary/20 decoration-4 italic uppercase tracking-tighter">Sustainability</p>
               </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* Recommended Section (Mock) */}
      <div className="bg-neutral-50 py-32 border-t border-neutral-100">
         <div className="responsive-container">
            <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter mb-16 italic underline decoration-primary/20 decoration-8 underline-offset-[12px]">You May Also Like</h2>
            <div className="responsive-grid grid-cols-2 lg:grid-cols-4 gap-8 opacity-40 grayscale transition-all hover:grayscale-0 hover:opacity-100">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="aspect-[4/5] bg-white border border-neutral-100 rounded-[2.5rem]" />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
