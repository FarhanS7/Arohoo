'use client';

import CartItemRow from '@/features/cart/components/CartItemRow';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

interface CartItem {
  productVariantId: string;
  quantity: number;
}

interface VariantData {
  id: string;
  price: number;
  stock: number;
  product: {
    name: string;
    images: { url: string }[];
  };
  size?: string;
  color?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [variantsData, setVariantsData] = useState<Record<string, VariantData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  // 1. Initial Load from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
        setCartItems([]);
      }
    }
    setIsInitializing(false);
  }, []);

  // 2. Fetch Live Variant Data (Never trust client price)
  useEffect(() => {
    if (isInitializing) return;

    const fetchVariants = async () => {
      setIsLoading(true);
      const newData: Record<string, VariantData> = {};
      const validItems: CartItem[] = [];

      await Promise.all(
        cartItems.map(async (item) => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/public/products/variants/${item.productVariantId}`);
            if (!res.ok) throw new Error('Variant not found');
            
            const { data } = await res.json();
            
            // Validate variant existence and stock
            if (data) {
                newData[item.productVariantId] = data;
                
                // If quantity > stock, adjust it
                const adjustedQty = item.quantity > data.stock ? data.stock : item.quantity;
                validItems.push({ ...item, quantity: adjustedQty });
            }
          } catch (error) {
            console.warn(`Variant ${item.productVariantId} not found, removing from cart.`);
            // Item stays out of validItems, effectively removing it
          }
        })
      );

      setVariantsData(newData);
      
      // Update cart state and localStorage if items were removed or adjusted
      if (validItems.length !== cartItems.length || JSON.stringify(validItems) !== JSON.stringify(cartItems)) {
          setCartItems(validItems);
          localStorage.setItem('cart', JSON.stringify(validItems));
      }
      
      setIsLoading(false);
    };

    if (cartItems.length > 0) {
      fetchVariants();
    } else {
      setIsLoading(false);
    }
  }, [isInitializing]); // Only runs once on mount after init

  // 3. Update Quantity
  const handleUpdateQuantity = (id: string, quantity: number) => {
    const updated = cartItems.map(item => 
      item.productVariantId === id ? { ...item, quantity } : item
    );
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  // 4. Remove Item
  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter(item => item.productVariantId !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  // 5. Calculate Totals
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const variant = variantsData[item.productVariantId];
      return acc + (variant ? variant.price * item.quantity : 0);
    }, 0);
  }, [cartItems, variantsData]);

  if (isLoading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading your premium cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-12 rounded-3xl shadow-xl shadow-gray-200/50 flex flex-col items-center gap-6 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
            <p className="text-gray-500 text-lg leading-relaxed">It seems you haven't added anything to your cart yet. Explore our sustainable collection!</p>
            <Link 
                href="/products" 
                className="mt-4 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-200"
            >
                Browse Products
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Shopping Bag</h1>
                <p className="text-gray-500 font-medium">You have <span className="text-indigo-600 font-bold">{cartItems.length}</span> items across your selection</p>
            </div>
            <Link href="/products" className="text-indigo-600 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                Continue Shopping
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Cart Content */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {cartItems.map((item) => (
                variantsData[item.productVariantId] && (
                  <CartItemRow
                    key={item.productVariantId}
                    item={item}
                    variant={variantsData[item.productVariantId]}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                )
              ))}
            </div>
            
            <button 
                onClick={() => {
                    setCartItems([]);
                    localStorage.removeItem('cart');
                }}
                className="self-end mt-2 text-sm text-gray-400 hover:text-red-500 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                Clear Entire Bag
            </button>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white rounded-[2rem] shadow-xl shadow-indigo-900/5 border border-indigo-50 p-8 flex flex-col gap-8">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Order Summary</h2>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span className="font-medium">Estimated Shipping</span>
                  <span className="text-green-600 font-bold uppercase text-xs tracking-widest bg-green-50 px-2 py-1 rounded">Free</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                    <span className="font-medium">Tax</span>
                    <span className="font-bold text-gray-900">$0.00</span>
                </div>
                
                <div className="h-px bg-gray-100 my-2"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-black text-indigo-600 tracking-tighter">${subtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <button className="w-full py-5 bg-indigo-600 text-white font-black text-lg rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3">
                  Proceed to Checkout
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
                <div className="flex items-center justify-center gap-4 text-xs font-medium text-gray-400">
                    <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Secure SSL</span>
                    <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Policy Protected</span>
                </div>
              </div>

              {/* Promo Code Info */}
              <div className="mt-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Sustainable Choice</p>
                  <p className="text-xs text-gray-600 leading-relaxed italic">By choosing Arohoo, you save <span className="text-green-600 font-bold">2.4kg</span> of rubber from landfills with this order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
