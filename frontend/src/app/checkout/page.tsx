'use client';

import CheckoutSummary from '@/features/checkout/components/CheckoutSummary';
import ShippingForm, { ShippingFormData } from '@/features/checkout/components/ShippingForm';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useToastContext } from '@/components/providers/ToastProvider';
import { useCart } from '@/features/cart/hooks/useCart';
import PageLayout from '@/components/layout/UX/PageLayout';

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
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-surface font-body px-4">
          <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">shopping_cart</span>
          </div>
          <h2 className="text-3xl font-extrabold text-on-surface font-headline mb-3">Your cart is empty</h2>
          <p className="text-on-surface-variant max-w-md text-center mb-10">Pick some premium footwear or structural aesthetics before checking out.</p>
          <button 
            onClick={() => router.push('/products')}
            className="px-8 py-4 bg-primary text-white rounded-xl font-bold tracking-widest hover:bg-primary-hover transition-all shadow-xl active:scale-95 flex items-center gap-2"
          >
            Start Exploring
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBackButton={true}>
      <main className="bg-surface p-6 lg:p-12 font-body text-on-surface min-h-screen">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
          
          {error && (
            <div className="lg:col-span-12 mb-2 p-4 bg-error-container border border-error/20 rounded-xl text-on-error-container text-sm flex items-center gap-3 animate-fade-in shadow-sm">
              <span className="material-symbols-outlined flex-shrink-0">error</span>
              <span className="font-bold">{error}</span>
            </div>
          )}

          <div className="lg:col-span-7">
            <ShippingForm 
              onSubmit={handleCheckout} 
              onDistrictChange={handleDistrictChange}
              isLoading={checkoutMutation.isPending} 
            />
          </div>

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
      </main>
    </PageLayout>
  );
};

export default CheckoutPage;
