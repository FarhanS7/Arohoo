'use client';

import CheckoutSummary from '@/features/checkout/components/CheckoutSummary';
import ShippingForm, { ShippingFormData } from '@/features/checkout/components/ShippingForm';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const [localCart, setLocalCart] = useState<CartItem[]>([]);
  const [liveItems, setLiveItems] = useState<LiveItem[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 1. Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed: CartItem[] = JSON.parse(savedCart);
        if (parsed.length === 0) {
          router.push('/cart');
          return;
        }
        setLocalCart(parsed);
      } catch (e) {
        console.error('Failed to parse cart', e);
        router.push('/cart');
      }
    } else {
      router.push('/cart');
    }
  }, [router]);

  // 2. Fetch live data for each variant (Never trust client price)
  useEffect(() => {
    if (localCart.length === 0) return;

    const fetchLiveData = async () => {
      setIsLoadingLive(true);
      setError(null);
      try {
        const fetched = await Promise.all(
          localCart.map(async (item) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/public/products/variants/${item.productVariantId}`);
            if (!res.ok) throw new Error('Failed to fetch price updates');
            const { data } = await res.json();
            
            return {
              ...item,
              id: data.id,
              price: Number(data.price),
              stock: data.stock,
              name: data.product.name,
              image: data.product.images?.[0]?.url,
              variantName: `${data.size || ''} ${data.color || ''}`.trim(),
              merchantName: data.product.merchantId, // simplified
            };
          })
        );

        setLiveItems(fetched);
        setTotal(fetched.reduce((acc, current) => acc + current.price * current.quantity, 0));
      } catch (err) {
        console.error(err);
        setError('Unable to sync live prices. Please try again.');
      } finally {
        setIsLoadingLive(false);
      }
    };

    fetchLiveData();
  }, [localCart]);

  // 3. Checkout Mutation
  const checkoutMutation = useMutation({
    mutationFn: async (shippingData: ShippingFormData) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cartItems: localCart.map(i => ({ productVariantId: i.productVariantId, quantity: i.quantity })),
          ...shippingData,
          address: `${shippingData.addressLine1}, ${shippingData.city}`, // matching backend's simple address logic for now
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Checkout failed');
      }

      return res.json();
    },
    onSuccess: (data) => {
      localStorage.removeItem('cart'); // Clear cart on success
      router.push(`/orders/${data.data.orderId}/success`);
    },
    onError: (err: any) => {
      setError(err.message);
    }
  });

  const handleCheckout = (formData: ShippingFormData) => {
    setError(null);
    // Double check stock before submission (visual only, backend enforces)
    const outOfStock = liveItems.find(item => item.quantity > item.stock);
    if (outOfStock) {
      setError(`Stock changed! Only ${outOfStock.stock} units of ${outOfStock.name} available.`);
      return;
    }
    checkoutMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
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
