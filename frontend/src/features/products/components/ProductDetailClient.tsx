"use client";

import { useCart } from "@/features/cart/hooks/useCart";
import { Product, ProductVariant } from "@/lib/api/products";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToastContext } from "@/components/providers/ToastProvider";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { addToast } = useToastContext();
  const [addingToCart, setAddingToCart] = useState(false);
  const allColors = Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))) as string[];
  const allSizes = Array.from(new Set(product.variants.map(v => v.size).filter(Boolean))) as string[];

  const [selectedColor, setSelectedColor] = useState<string | null>(allColors.length > 0 ? allColors[0] : null);
  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    const defaultColor = allColors.length > 0 ? allColors[0] : null;
    const sizesForColor = defaultColor 
      ? product.variants.filter(v => v.color === defaultColor).map(v => v.size).filter(Boolean)
      : allSizes;
    return sizesForColor.length > 0 ? (sizesForColor[0] as string) : null;
  });

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const [mainImage, setMainImage] = useState<string | null>(
    product.images.length > 0 ? product.images[0].url : '/placeholder-product.png'
  );

  // Sync state if product prop changes (handles soft navigation and updates)
  useEffect(() => {
    if (product.images.length > 0) {
      setMainImage(product.images[0].url);
    } else {
      setMainImage('/placeholder-product.png');
    }
    
    const newColors = Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))) as string[];
    const newSizes = Array.from(new Set(product.variants.map(v => v.size).filter(Boolean))) as string[];
    
    const dColor = newColors.length > 0 ? newColors[0] : null;
    setSelectedColor(dColor);
    
    const dSizesForColor = dColor 
      ? product.variants.filter(v => v.color === dColor).map(v => v.size).filter(Boolean)
      : newSizes;
      
    setSelectedSize(dSizesForColor.length > 0 ? (dSizesForColor[0] as string) : null);
  }, [product.id, product.images, product.variants]);

  // Sync selected size if color changes
  useEffect(() => {
    const sizes = selectedColor 
      ? product.variants.filter(v => v.color === selectedColor).map(v => v.size).filter(Boolean)
      : allSizes;
      
    if (selectedSize && !sizes.includes(selectedSize) && sizes.length > 0) {
      setSelectedSize(sizes[0] as string);
    }
  }, [selectedColor, product.variants, allSizes, selectedSize]);

  // Update selected variant based on color and size
  useEffect(() => {
    let matchingVariant = null;
    if (allColors.length > 0 && allSizes.length > 0) {
        matchingVariant = product.variants.find(v => v.color === selectedColor && v.size === selectedSize);
    } else if (allColors.length > 0) {
        matchingVariant = product.variants.find(v => v.color === selectedColor);
    } else if (allSizes.length > 0) {
        matchingVariant = product.variants.find(v => v.size === selectedSize);
    } else {
        matchingVariant = product.variants[0] || null;
    }
    setSelectedVariant(matchingVariant || null);
  }, [selectedColor, selectedSize, product.variants, allColors.length, allSizes.length]);

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
    <main className="max-w-7xl mx-auto px-8 pt-8 pb-24 font-body min-h-screen">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center space-x-2 text-sm font-medium tracking-wide text-on-surface-variant">
        <Link className="hover:text-primary transition-colors" href="/">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link className="hover:text-primary transition-colors" href="/products">Shop</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-on-surface font-semibold truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-1 space-y-4">
          <div className="aspect-[4/5] max-h-[520px] bg-surface-container-low rounded-xl overflow-hidden relative group">
            <Image 
              src={mainImage || '/placeholder-product.png'}
              alt={product.name}
              fill
              priority
              className="object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute top-6 right-6">
              <button className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-on-surface-variant hover:text-error transition-colors shadow-sm">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.slice(0, 4).map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setMainImage(img.url)}
                  className={`aspect-square bg-surface-container-low rounded-lg overflow-hidden transition-opacity cursor-pointer relative ${mainImage === img.url ? 'border-2 border-primary' : 'hover:opacity-80'}`}
                >
                  <Image 
                    src={img.url} 
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div className="lg:col-span-1 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
              {product.isTrending ? 'Trending' : 'New Arrival'}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-on-surface leading-tight mb-1 font-headline">{product.name}</h1>
          <p className="text-2xl font-light text-primary mb-4">৳{(selectedVariant?.price || product.basePrice).toLocaleString()}</p>

          <div className="flex items-center p-3 bg-surface-container-low rounded-xl mb-4">
            <div className="relative w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center mr-3 overflow-hidden">
               {product.merchant?.logo ? (
                 <Image src={product.merchant.logo} alt={product.merchant.storeName || 'Merchant'} fill className="object-cover" />
               ) : (
                 <span className="material-symbols-outlined text-on-secondary-container">storefront</span>
               )}
            </div>
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-tighter">Sold by</p>
              <Link href={`/merchants/${product.merchant?.slug}`} className="text-sm font-bold text-on-surface hover:underline underline-offset-4 decoration-primary/50">
                {product.merchant?.storeName || 'Verified Merchant'}
              </Link>
            </div>
            <span className="material-symbols-outlined text-primary ml-auto">verified</span>
          </div>

          {/* Selectors */}
          <div className="space-y-6 mb-8">
            {allColors.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {allColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-6 py-3 border rounded-xl text-sm font-medium transition-all ${selectedColor === c ? 'border-2 border-primary text-primary font-bold bg-primary/5' : 'border-surface-container-high hover:border-primary hover:text-primary text-on-surface'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {allSizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Size</h3>
                  <button className="text-xs font-medium text-primary underline underline-offset-4 decoration-secondary-fixed">Size Guide</button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {allSizes.map((s) => {
                    // Check if this size is available for the currently selected color
                    const isAvailable = selectedColor 
                      ? product.variants.some(v => v.color === selectedColor && v.size === s)
                      : true;
                    
                    return (
                      <button
                        key={s}
                        onClick={() => { if(isAvailable) setSelectedSize(s); }}
                        disabled={!isAvailable}
                        className={`h-12 border rounded-xl flex items-center justify-center text-sm font-medium transition-all ${selectedSize === s ? 'border-2 border-primary text-primary font-bold bg-primary/5' : !isAvailable ? 'border-surface-container-low text-on-surface-variant/30 bg-surface-container-lowest cursor-not-allowed' : 'border-surface-container-high hover:border-primary hover:text-primary text-on-surface'}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {selectedVariant?.stock === 0 && (
              <p className="text-error text-sm font-bold bg-error/5 p-3 rounded-xl inline-block mt-2">Currently out of stock.</p>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 mb-6">
            <button 
              onClick={handleAddToCart}
              disabled={addingToCart || !selectedVariant || selectedVariant.stock === 0}
              className="w-full h-12 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover hover:shadow-lg transition-all scale-100 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {addingToCart ? 'Syncing...' : selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
            <button className="w-full h-14 bg-surface-container-high text-on-surface rounded-xl font-bold hover:bg-secondary-fixed transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">favorite</span>
              Add to Wishlist
            </button>
          </div>

          {/* Editorial Description */}
          <div className="border-t border-surface-container-high pt-8 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">The Narrative</h3>
              <div className="text-on-surface-variant leading-relaxed font-body">
                {product.description || "Meticulously crafted from premium materials, this piece redefines effortless sophistication. Featuring a contemporary silhouette, it strikes the perfect balance between uncompromising luxury and relaxed seasonal wear."}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border-l-4 border-primary">
              <span className="material-symbols-outlined text-primary mt-0.5">local_shipping</span>
              <div>
                <p className="text-sm font-bold text-on-surface">Protected Transaction</p>
                <p className="text-xs text-on-surface-variant">Your order is secured by the Ethereal Marketplace zero-liability guarantee policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like (Mock) */}
      <section className="mt-32 border-t border-surface-container-high pt-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-on-surface font-headline">Featured Collection</h2>
            <p className="text-on-surface-variant mt-2 font-body">Curated selections from trending merchants.</p>
          </div>
          <Link href="/products" className="text-primary font-bold text-sm tracking-widest uppercase hover:underline underline-offset-8">Explore All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {[1,2,3,4].map((i) => (
             <div key={i} className="group cursor-pointer">
               <div className="aspect-[3/4] bg-surface-container-low rounded-xl overflow-hidden mb-4 relative flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-20">inventory_2</span>
               </div>
               <div className="h-4 w-3/4 bg-surface-container-high rounded mb-2"></div>
               <div className="h-3 w-1/4 bg-surface-container-low rounded"></div>
             </div>
           ))}
        </div>
      </section>
    </main>
  );
}
