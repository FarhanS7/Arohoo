import { api as client } from "./client";

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

export const cartApi = {
  /**
   * Fetches the current user's cart.
   */
  getCart: async () => {
    const response = await client.get<{ success: boolean; data: Cart }>("/cart");
    return response.data;
  },

  /**
   * Adds an item to the cart.
   */
  addItem: async (productVariantId: string, quantity: number = 1) => {
    const response = await client.post<{ success: boolean; data: Cart }>("/cart/items", {
      productVariantId,
      quantity,
    });
    return response.data;
  },

  /**
   * Updates the quantity of a cart item.
   */
  updateQuantity: async (cartItemId: string, quantity: number) => {
    const response = await client.patch<{ success: boolean; data: Cart }>(`/cart/items/${cartItemId}`, {
      quantity,
    });
    return response.data;
  },

  /**
   * Removes an item from the cart.
   */
  removeItem: async (cartItemId: string) => {
    const response = await client.delete<{ success: boolean; data: Cart }>(`/cart/items/${cartItemId}`);
    return response.data;
  },

  /**
   * Clears the entire cart.
   */
  clearCart: async () => {
    const response = await client.delete<{ success: boolean; data: Cart }>("/cart");
    return response.data;
  },
};
