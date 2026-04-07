"use client";

import { useCart } from "@/features/cart/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import PageLayout from "@/components/layout/UX/PageLayout";
import BackButton from "@/components/layout/UX/BackButton";
import StateView from "@/components/layout/UX/StateView";

export default function CartPage() {
  const { 
    cart, 
    loading, 
    removeItem, 
    updateQuantity, 
    totalPrice, 
    itemCount 
  } = useCart();

  if (loading) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] items-center justify-center p-8 bg-surface font-body">
          <StateView state="loading" title="Syncing your bag..." />
        </div>
      </PageLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 bg-surface font-body">
          <StateView 
            state="empty" 
            title="Your bag is empty" 
            message="Looks like you haven't selected anything yet. Every piece is curated for your unique editorial lifestyle."
            cta={
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white transition-all hover:bg-primary-hover shadow-xl scale-100 active:scale-95"
              >
                Start Exploring
              </Link>
            }
          />
        </div>
      </PageLayout>
    );
  }

  const tax = totalPrice * 0.08; // 8% estimated tax

  return (
    <PageLayout>
      <main className="pt-8 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen font-body text-on-background">
        <BackButton className="mb-4" />
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-4 font-headline">Your Bag</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">Review your selected items and prepare for checkout. Every piece is curated for your unique lifestyle.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-surface-container-lowest p-6 rounded-xl flex gap-6 items-center flex-col sm:flex-row group transition-all hover:shadow-sm border border-surface-container-high lg:border-transparent">
                <Link href={`/products/${item.productVariant.product.id}`} className="w-full sm:w-32 h-48 sm:h-40 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 cursor-pointer block">
                  <Image
                    src={item.productVariant.product.images?.[0]?.url || "/placeholder-product.png"}
                    alt={item.productVariant.product.name}
                    width={128}
                    height={160}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                
                <div className="flex-grow w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs tracking-widest uppercase text-primary font-bold mb-1">
                        {(item.productVariant.product as any).merchant?.storeName || 'Ethereal Collection'}
                      </p>
                      <Link href={`/products/${item.productVariant.product.id}`}>
                        <h3 className="text-xl font-bold font-headline text-on-surface mb-2 hover:text-primary transition-colors">
                          {item.productVariant.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-on-surface-variant mb-4">
                        {[
                           item.productVariant.color ? `Color: ${item.productVariant.color}` : null,
                           item.productVariant.size ? `Size: ${item.productVariant.size}` : null
                        ].filter(Boolean).join(' • ')}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-on-surface-variant hover:text-error transition-colors p-2 -mr-2 -mt-2"
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>close</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:text-primary transition-all text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="w-8 text-center font-medium text-sm text-on-surface">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:text-primary transition-all text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                    <p className="text-lg font-bold font-headline text-primary">
                      ৳{(Number(item.productVariant.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Bento Grid Promo Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              <div className="bg-primary/5 p-8 rounded-xl flex flex-col justify-center border border-primary/20">
                <span className="material-symbols-outlined text-primary mb-4 text-3xl">redeem</span>
                <h4 className="text-lg font-bold font-headline mb-2 text-on-surface">Digital Experience</h4>
                <p className="text-sm text-on-surface-variant">Shop securely utilizing modern web standards.</p>
              </div>
              <div className="bg-secondary-container/20 p-8 rounded-xl flex flex-col justify-center border border-secondary-container/20">
                <span className="material-symbols-outlined text-secondary mb-4 text-3xl">local_shipping</span>
                <h4 className="text-lg font-bold font-headline mb-2 text-on-surface">Standard Delivery</h4>
                <p className="text-sm text-on-surface-variant">Member benefit: Reliable delivery across Bangladesh.</p>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-surface-container-low p-8 rounded-xl border border-surface-container-highest">
              <h2 className="text-2xl font-bold font-headline mb-8 text-on-surface">Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-on-surface">৳{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Shipping Estimate</span>
                  <span className="font-semibold text-primary">TBD at Checkout</span>
                </div>
                
                <div className="pt-4 border-t border-outline-variant/30 flex justify-between">
                  <span className="text-lg font-bold font-headline text-on-surface">Est. Total</span>
                  <span className="text-lg font-bold font-headline text-primary">৳{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all scale-100 active:scale-95 flex justify-center items-center gap-2 mb-6 shadow-lg shadow-primary/20"
              >
                Proceed to Checkout
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-sm">security</span>
                  Secure encrypted transaction
                </div>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-sm text-primary">verified</span>
                  Authenticity guaranteed
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
