"use client";

import { useCartContext } from "../cart.context";

/**
 * Proxy hook that consumes the global CartProvider state.
 * Ensures that components calling useCart() always share the same single source of truth.
 */
export function useCart() {
  return useCartContext();
}
