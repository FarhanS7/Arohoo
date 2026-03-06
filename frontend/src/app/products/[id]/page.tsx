"use client";

import { Product, productService, ProductVariant } from "@/lib/api/products";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await productService.getPublicProductById(id as string);
        if (res.success) {
          setProduct(res.data);
          if (res.data.variants.length > 0) {
            setSelectedVariant(res.data.variants[0]);
          }
          if (res.data.images.length > 0) {
            setMainImage(res.data.images[0].url);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase italic">{error || "Product Not Found"}</h2>
        <p className="text-gray-500 mb-8">This item may have been moved or is no longer available.</p>
        <a href="/products" className="px-8 py-3 bg-black text-white font-bold rounded-xl text-xs uppercase tracking-widest">
          Back to Catalog
        </a>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [{ url: '/placeholder-product.png', order: 0 }];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
               <img 
                 src={mainImage ? (mainImage.startsWith('http') ? mainImage : `http://localhost:8000${mainImage}`) : '/placeholder-product.png'}
                 alt={product.name}
                 className="w-full h-full object-cover object-center transition-all duration-700 hover:scale-110"
               />
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(img.url)}
                    className={`flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${mainImage === img.url ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-lg scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img 
                      src={img.url.startsWith('http') ? img.url : `http://localhost:8000${img.url}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="border-b border-gray-100 pb-8">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 block italic">New Arrival</span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight uppercase leading-none mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-black text-gray-900 leading-none">
                ${selectedVariant?.price || product.basePrice}
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
                         className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all ${selectedVariant?.id === v.id ? 'bg-black border-black text-white shadow-xl -translate-y-1' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300'}`}
                       >
                         {v.attributes.size} {v.attributes.color && `- ${v.attributes.color}`}
                       </button>
                     ))}
                   </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <button className="w-full py-5 bg-black text-white font-bold rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 active:scale-95">
                  Add to Cart
                  <span className="opacity-40 text-sm">/</span>
                  <span className="opacity-90">Bag</span>
                </button>
                <div className="flex items-center justify-center gap-6 text-[10px] uppercase font-bold text-gray-400 tracking-widest pt-2">
                   <div className="flex items-center gap-2">
                     <span className="w-1 h-1 rounded-full bg-green-500"></span>
                     In Stock
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 border border-indigo-400 rounded-full"></span>
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
                  <p className="text-xs font-bold text-gray-700 underline underline-offset-4 decoration-indigo-200">Sustainability</p>
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
