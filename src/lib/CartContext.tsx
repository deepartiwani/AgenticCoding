"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { addToCartAction } from "@/app/cart/actions";

interface CartContextValue {
  /** Total quantity of items in the cart */
  itemCount: number;
  /** Whether an add-to-cart operation is currently in flight */
  isAdding: boolean;
  /** Add a product to the cart. Returns true on success. */
  addToCart: (productId: string, variantId?: number, quantity?: number) => Promise<boolean>;
  /** Manually set the item count (e.g. after initial load from server) */
  setItemCount: (count: number) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({
  children,
  initialCount = 0,
}: {
  children: ReactNode;
  initialCount?: number;
}) {
  const [itemCount, setItemCount] = useState(initialCount);
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = useCallback(
    async (productId: string, variantId = 1, quantity = 1): Promise<boolean> => {
      setIsAdding(true);
      try {
        const result = await addToCartAction(productId, variantId, quantity);
        if (result.success) {
          setItemCount(result.totalLineItemQuantity);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setIsAdding(false);
      }
    },
    []
  );

  return (
    <CartContext.Provider value={{ itemCount, isAdding, addToCart, setItemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
