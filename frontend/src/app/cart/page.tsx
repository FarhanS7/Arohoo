"use client";

import { useCart } from "@/features/cart/hooks/useCart";
import Link from "next/link";

export default function CartPage() {
  const { cart, loading, error, updateQuantity, removeItem, clearCart, totalPrice, itemCount } = useCart();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase italic">Cart Error</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-black text-white font-bold rounded-xl text-xs uppercase tracking-widest">
          Retry
        </button>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="flex items-baseline justify-between border-b border-gray-100 pb-8 mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight uppercase italic">
            Your Bag <span className="text-indigo-600">/</span> <span className="text-gray-400">{itemCount}</span>
          </h1>
          {items.length > 0 && (
            <button 
              onClick={clearCart}
              className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase">Your Bag is Empty</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8">Items added to your bag will appear here. Start browsing our collection.</p>
            <Link 
              href="/products" 
              className="px-10 py-4 bg-black text-white font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-gray-800 transition-all inline-block"
            >
              Shop Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 pb-8 border-b border-gray-50 group">
                  <div className="w-24 h-32 md:w-32 md:h-40 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={`http://localhost:8000/placeholder-product.png`} // Fallback, update with real images if available
                      alt="Product"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="flex-grow flex flex-col pt-2">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight leading-none mb-1">
                          {item.productVariant?.product?.name || `Product ${item.productVariantId.substring(0, 4)}`}
                        </h3>
                        <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                          <span>{item.productVariant?.size || 'OS'}</span>
                          <span>{item.productVariant?.color || 'N/A'}</span>
                        </div>
                      </div>
                      <p className="text-lg font-black text-gray-900">${item.productVariant?.price || 0}</p>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-4 py-2 hover:bg-gray-50 text-gray-500 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-4 py-2 hover:bg-gray-50 text-gray-500 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-gray-50 rounded-3xl p-8 sticky top-24">
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-8 border-b pb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-gray-900">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">Free</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mb-10 flex justify-between items-baseline">
                   <h3 className="text-xl font-bold text-gray-900 uppercase italic">Total</h3>
                   <p className="text-2xl font-black text-gray-900 tracking-tight">${totalPrice}</p>
                </div>

                <Link 
                  href="/checkout"
                  className="w-full py-5 bg-black text-white font-bold rounded-2xl text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 active:scale-95 mb-4"
                >
                  Proceed to Checkout
                </Link>
                
                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose">
                  Complimentary international shipping <br /> & carbon neutral delivery.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
