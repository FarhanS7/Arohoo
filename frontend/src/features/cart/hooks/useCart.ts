"use client";

import { useAuth } from "@/features/auth/auth.context";
import { Cart, cartApi } from "@/lib/api/cart";
import { useCallback, useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "arohoo_guest_cart";

/**
 * Hook to manage shopping cart state.
 * Syncs with the backend for logged-in users and localStorage for guests.
 */
export function useCart() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Initial Load
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const res = await cartApi.getCart();
        if (res.success) {
          setCart(res.data);
        }
      } else {
        // Guest cart from localStorage
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          setCart(JSON.parse(saved));
        } else {
          setCart({ id: "guest", userId: "guest", items: [] });
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // 2. Add Item
  const addItem = async (productVariantId: string, quantity: number = 1) => {
    try {
      if (isAuthenticated) {
        const res = await cartApi.addItem(productVariantId, quantity);
        if (res.success) setCart(res.data);
      } else {
        // Logic for guest cart in localStorage would be more complex (need to fetch variant info)
        // For MVP, we'll mostly emphasize logged-in cart, but we can store ID/Qty
        const currentCart = cart || { id: "guest", userId: "guest", items: [] };
        const items = [...currentCart.items];
        const existing = items.find(i => i.productVariantId === productVariantId);
        
        if (existing) {
          existing.quantity += quantity;
        } else {
          // Note: Full variant details normally fetched from backend if we wanted a rich guest cart
          // For now, we'll redirect guest to login or just show minimal
          // We'll implement basic aggregation here
          items.push({
            id: `temp-${Date.now()}`,
            cartId: "guest",
            productVariantId,
            quantity,
            productVariant: { id: productVariantId } as any // Simplified
          });
        }
        
        const newCart = { ...currentCart, items };
        setCart(newCart);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCart));
      }
    } catch (err: any) {
      setError(err.message || "Failed to add item");
      throw err;
    }
  };

  // 3. Update Quantity
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (isAuthenticated) {
      const res = await cartApi.updateQuantity(cartItemId, quantity);
      if (res.success) setCart(res.data);
    } else {
      if (!cart) return;
      const items = cart.items.map(i => 
        i.id === cartItemId ? { ...i, quantity } : i
      ).filter(i => i.quantity > 0);
      
      const newCart = { ...cart, items };
      setCart(newCart);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCart));
    }
  };

  // 4. Remove Item
  const removeItem = async (cartItemId: string) => {
    if (isAuthenticated) {
      const res = await cartApi.removeItem(cartItemId);
      if (res.success) setCart(res.data);
    } else {
      if (!cart) return;
      const items = cart.items.filter(i => i.id !== cartItemId);
      const newCart = { ...cart, items };
      setCart(newCart);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCart));
    }
  };

  // 5. Clear Cart
  const clearCart = async () => {
    if (isAuthenticated) {
      await cartApi.clearCart();
      setCart({ id: cart?.id || "", userId: user?.id || "", items: [] });
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCart({ id: "guest", userId: "guest", items: [] });
    }
  };

  return {
    cart,
    loading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: fetchCart,
    itemCount: cart?.items.reduce((acc, i) => acc + i.quantity, 0) || 0,
    totalPrice: cart?.items.reduce((acc, i) => acc + (i.productVariant?.price || 0) * i.quantity, 0) || 0
  };
}
