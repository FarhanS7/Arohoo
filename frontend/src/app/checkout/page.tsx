'use client';

import CheckoutSummary from '@/features/checkout/components/CheckoutSummary';
import ShippingForm, { ShippingFormData } from '@/features/checkout/components/ShippingForm';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useToastContext } from '@/components/providers/ToastProvider';
import { useCart } from '@/features/cart/hooks/useCart';
import Navbar from '@/components/layout/Navbar';

interface LiveItem {
  productVariantId: string;
  quantity: number;
  id: string;
  price: number;
  stock: number;
  name: string;
  image?: string;
  variantName?: string;
  merchantName?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const CheckoutPage = () => {
  const router = useRouter();
  const { addToast } = useToastContext();
  const { cart, loading: cartLoading, clearCart } = useCart();
  
  const [liveItems, setLiveItems] = useState<LiveItem[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(70);
  const [shippingDistrict, setShippingDistrict] = useState<'Chattogram' | 'Other'>('Chattogram');
  const [error, setError] = useState<string | null>(null);
 
  // 1. Fetch live data for the entire cart in ONE request
  useEffect(() => {
    if (cartLoading || !cart || cart.items.length === 0) {
      if (!cartLoading && (!cart || cart.items.length === 0)) {
        setIsLoadingLive(false);
      }
      return;
    }

    const fetchLiveData = async () => {
      setIsLoadingLive(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/checkout/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItems: cart.items.map((i: any) => ({
              productVariantId: i.productVariantId,
              quantity: i.quantity
            }))
          })
        });

        if (!res.ok) throw new Error('Failed to sync live prices');
        
        const { data } = await res.json();
        
        setLiveItems(data.items);
        setSubtotal(data.subtotal);
      } catch (err) {
        console.error(err);
        setError('Checkout was unable to sync live prices. Please try again.');
      } finally {
        setIsLoadingLive(false);
      }
    };

    fetchLiveData();
  }, [cart, cartLoading]);

  const handleDistrictChange = useCallback((district: 'Chattogram' | 'Other') => {
    setShippingDistrict(district);
    setShippingCost(district === 'Chattogram' ? 70 : 130);
  }, []);

  // 2. Checkout Mutation
  const checkoutMutation = useMutation({
    mutationFn: async (shippingData: ShippingFormData) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const payload = {
        cartItems: cart?.items.map((i: any) => ({ 
          productVariantId: i.productVariantId, 
          quantity: i.quantity 
        })),
        ...shippingData,
        shippingDistrict,
        shippingCost,
        address: `${shippingData.addressLine1}, ${shippingData.city}`, 
      };

      const res = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Order placement failed');
      }

      return res.json();
    },
    onSuccess: (data) => {
      clearCart();
      addToast('success', 'Order placed successfully!');
      router.push(`/orders/${data.data.orderId}/success`);
    },
    onError: (err: any) => {
      setError(err.message);
      addToast('error', err.message);
    }
  });

  const handleCheckout = useCallback((formData: ShippingFormData) => {
    setError(null);
    if (!liveItems.length) return;

    const outOfStock = liveItems.find(item => item.quantity > item.stock);
    if (outOfStock) {
      setError(`Stock changed! Only ${outOfStock.stock} units of ${outOfStock.name} available.`);
      return;
    }
    checkoutMutation.mutate(formData);
  }, [liveItems, checkoutMutation]);

  if (!cartLoading && (!cart || cart.items.length === 0)) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center font-sans">
        <Navbar />
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Your cart is empty</h2>
          <p className="text-neutral-500">Pick some premium footwear before checking out.</p>
          <button 
            onClick={() => router.push('/products')}
            className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Checkout</h1>
          <p className="mt-2 text-neutral-500">Fast guest checkout. No login required.</p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm flex items-center gap-3 animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Shipping Form */}
          <div className="lg:col-span-7">
            <ShippingForm 
              onSubmit={handleCheckout} 
              onDistrictChange={handleDistrictChange}
              isLoading={checkoutMutation.isPending} 
            />
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <CheckoutSummary 
                items={liveItems.map(i => ({ 
                  ...i, 
                  subtotal: i.price * i.quantity 
                }))} 
                subtotal={subtotal} 
                shippingCost={shippingCost}
                isLoading={isLoadingLive}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
