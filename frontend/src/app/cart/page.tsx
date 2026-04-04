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
        <div className="flex min-h-[60vh] items-center justify-center p-8 bg-zinc-50 dark:bg-black font-sans">
          <StateView state="loading" title="Syncing your bag..." />
        </div>
      </PageLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-black font-sans">
          <StateView 
            state="empty" 
            title="Your bag is empty" 
            message="Looks like you haven't added anything to your cart yet. Let's find something for you!"
            cta={
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-8 text-base font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 shadow-xl shadow-zinc-200"
              >
                Start Shopping
              </Link>
            }
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-zinc-50 dark:bg-black font-sans">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <BackButton className="mb-8" />
          <h1 className="mb-10 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Shopping Cart</h1>

          <div className="flex flex-col gap-x-12 lg:flex-row lg:items-start">
            {/* Cart Items List */}
            <div className="flex-1">
              <ul className="divide-y divide-zinc-200 border-b border-t border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 sm:h-32 sm:w-32">
                      <Image
                        src={item.productVariant.product.images?.[0]?.url || "/placeholder-product.png"}
                        alt={item.productVariant.product.name}
                        fill
                        sizes="128px"
                        className="object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm font-semibold">
                              <Link href={`/products/${item.productVariant.product.id}`} className="text-zinc-900 hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300">
                                {item.productVariant.product.name}
                              </Link>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            {item.productVariant.color && <p className="border-r border-zinc-200 pr-3 dark:border-zinc-800">{item.productVariant.color}</p>}
                            {item.productVariant.size && <p className="pl-3">{item.productVariant.size}</p>}
                          </div>
                          <p className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-50">
                            ৳{Number(item.productVariant.price).toLocaleString()}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-full border border-zinc-200 dark:border-zinc-800">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="flex h-8 w-8 items-center justify-center text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-6 text-center text-sm font-bold text-zinc-900 dark:text-zinc-50">
                                  {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="flex h-8 w-8 items-center justify-center text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-zinc-900"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Summary */}
            <section className="mt-16 bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 lg:mt-0 lg:w-96">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Order summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Subtotal ({itemCount} items)</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">৳{totalPrice.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-900">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Shipping estimate</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">৳0</p>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-900">
                  <p className="text-base font-bold text-zinc-900 dark:text-zinc-50">Order total</p>
                  <p className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">৳{totalPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/checkout"
                  className="flex w-full items-center justify-center rounded-full bg-zinc-950 px-6 py-4 text-base font-bold text-zinc-50 transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  Checkout
                </Link>
              </div>
              
              <p className="mt-4 text-center text-xs text-zinc-500">
                  Secure transaction with multi-tenant isolation.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
