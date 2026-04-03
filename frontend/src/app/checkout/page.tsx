'use client';

import CheckoutSummary from '@/features/checkout/components/CheckoutSummary';
import ShippingForm, { ShippingFormData } from '@/features/checkout/components/ShippingForm';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/auth.context';
import { useToastContext } from '@/components/providers/ToastProvider';
import { useCart } from '@/features/cart/hooks/useCart';
import Navbar from '@/components/layout/Navbar';

interface CartItem {
  productVariantId: string;
  quantity: number;
}

interface LiveItem extends CartItem {
  id: string; // variant id
  price: number;
  stock: number;
  name: string;
  image?: string;
  variantName?: string;
  merchantName?: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToastContext();
  const { cart, loading: cartLoading } = useCart();
  const [liveItems, setLiveItems] = useState<LiveItem[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 0. Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      addToast('info', 'Please login to proceed to checkout');
      router.push(`/login?redirect=/checkout`);
    }
  }, [user, authLoading, router, addToast]);

  // 1. Fetch live data for each cart item
  useEffect(() => {
    if (cartLoading || !cart || cart.items.length === 0) {
      return;
    }

    const fetchLiveData = async () => {
      setIsLoadingLive(true);
      setError(null);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const fetched = await Promise.all(
          cart.items.map(async (item: any) => {
            const res = await fetch(`${API_URL}/public/products/variants/${item.productVariantId}`);
            if (!res.ok) throw new Error('Failed to fetch price updates');
            const { data } = await res.json();
            
            return {
              productVariantId: item.productVariantId,
              quantity: item.quantity,
              id: data.id,
              price: Number(data.price),
              stock: data.stock,
              name: data.product.name,
              image: data.product.images?.[0]?.url,
              variantName: `${data.size || ''} ${data.color || ''}`.trim(),
              merchantName: data.product.merchant.storeName,
            };
          })
        );

        setLiveItems(fetched);
        setTotal(fetched.reduce((acc: number, current: LiveItem) => acc + current.price * current.quantity, 0));
      } catch (err) {
        console.error(err);
        setError('Unable to sync live prices. Please try again.');
      } finally {
        setIsLoadingLive(false);
      }
    };

    fetchLiveData();
  }, [cart, cartLoading]);

  // 2. Checkout Mutation
  const checkoutMutation = useMutation({
    mutationFn: async (shippingData: ShippingFormData) => {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const res = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cartItems: cart?.items.map((i: any) => ({ productVariantId: i.productVariantId, quantity: i.quantity })),
          ...shippingData,
          address: `${shippingData.addressLine1}, ${shippingData.city}`, 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Checkout failed');
      }

      return res.json();
    },
    onSuccess: (data) => {
      localStorage.removeItem('arohoo_guest_cart');
      router.push(`/orders/${data.data.id}/success`);
    },
    onError: (err: any) => {
      setError(err.message);
    }
  });

  const handleCheckout = (formData: ShippingFormData) => {
    setError(null);
    const outOfStock = liveItems.find(item => item.quantity > item.stock);
    if (outOfStock) {
      setError(`Stock changed! Only ${outOfStock.stock} units of ${outOfStock.name} available.`);
      return;
    }
    checkoutMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Checkout</h1>
          <p className="mt-2 text-neutral-500">Secure your premium footwear collection.</p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Shipping Form */}
          <div className="lg:col-span-7">
            <ShippingForm onSubmit={handleCheckout} isLoading={checkoutMutation.isPending} />
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-12">
              <CheckoutSummary 
                items={liveItems.map(i => ({ 
                  ...i, 
                  subtotal: i.price * i.quantity 
                }))} 
                total={total} 
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
