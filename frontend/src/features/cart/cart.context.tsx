"use client";

import { useAuth } from "@/features/auth/auth.context";
import { Cart, cartApi } from "@/lib/api/cart";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState, useMemo } from "react";

const LOCAL_STORAGE_KEY = "arohoo_guest_cart";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addItem: (productVariantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const res = await cartApi.getCart();
        if (res.success) {
          setCart(res.data);
        }
      } else {
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

  const addItem = useCallback(async (productVariantId: string, quantity: number = 1) => {
    try {
      if (isAuthenticated) {
        const res = await cartApi.addItem(productVariantId, quantity);
        if (res.success) setCart(res.data);
      } else {
        const currentCart = cart || { id: "guest", userId: "guest", items: [] };
        const items = [...currentCart.items];
        const existing = items.find(i => i.productVariantId === productVariantId);
        
        if (existing) {
          existing.quantity += quantity;
        } else {
          const { productService } = await import("@/lib/api/products");
          const { data } = await productService.getPublicVariantById(productVariantId);
          
          items.push({
            id: `temp-${Date.now()}`,
            cartId: "guest",
            productVariantId,
            quantity,
            productVariant: {
              id: data.id,
              price: data.price,
              product: {
                name: data.product.name,
                images: data.product.images
              }
            } as any
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
  }, [isAuthenticated, cart]);

  const updateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
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
  }, [isAuthenticated, cart]);

  const removeItem = useCallback(async (cartItemId: string) => {
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
  }, [isAuthenticated, cart]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      await cartApi.clearCart();
      setCart({ id: cart?.id || "", userId: user?.id || "", items: [] });
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCart({ id: "guest", userId: "guest", items: [] });
    }
  }, [isAuthenticated, cart, user?.id]);

  const itemCount = useMemo(() => 
    cart?.items.reduce((acc, i) => acc + i.quantity, 0) || 0,
  [cart]);

  const totalPrice = useMemo(() => 
    cart?.items.reduce((acc, i) => acc + (i.productVariant?.price || 0) * i.quantity, 0) || 0,
  [cart]);

  const value = useMemo(() => ({
    cart,
    loading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: fetchCart,
    itemCount,
    totalPrice
  }), [cart, loading, error, addItem, updateQuantity, removeItem, clearCart, fetchCart, itemCount, totalPrice]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used within a CartProvider");
  return context;
}
