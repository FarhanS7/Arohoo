import { api } from "./client";

export interface CartItem {
  id: string;
  cartId: string;
  productVariantId: string;
  quantity: number;
  productVariant: {
    id: string;
    sku: string;
    price: number;
    stock: number;
    size: string | null;
    color: string | null;
    product: {
      id: string;
      name: string;
    };
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

/**
 * Cart API Service
 */
export const cartApi = {
  /**
   * Fetches the current user's cart.
   */
  async getCart(): Promise<{ success: boolean; data: Cart }> {
    const res = await api.get<{ success: boolean; data: Cart }>("/cart");
    return res.data;
  },

  /**
   * Adds an item to the cart.
   */
  async addItem(productVariantId: string, quantity: number = 1): Promise<{ success: boolean; data: Cart }> {
    const res = await api.post<{ success: boolean; data: Cart }>("/cart/items", {
      productVariantId,
      quantity,
    });
    return res.data;
  },

  /**
   * Updates the quantity of a cart item.
   */
  async updateQuantity(cartItemId: string, quantity: number): Promise<{ success: boolean; data: Cart }> {
    const res = await api.patch<{ success: boolean; data: Cart }>(`/cart/items/${cartItemId}`, {
      quantity,
    });
    return res.data;
  },

  /**
   * Removes an item from the cart.
   */
  async removeItem(cartItemId: string): Promise<{ success: boolean; data: Cart }> {
    const res = await api.delete<{ success: boolean; data: Cart }>(`/cart/items/${cartItemId}`);
    return res.data;
  },

  /**
   * Clears the entire cart.
   */
  async clearCart(): Promise<{ success: boolean; data: Cart }> {
    const res = await api.delete<{ success: boolean; data: Cart }>("/cart");
    return res.data;
  },
};
