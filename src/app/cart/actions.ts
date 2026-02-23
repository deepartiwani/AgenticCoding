"use server";

import { cookies } from "next/headers";
import {
  createCart,
  getCartById,
  addLineItem,
  changeLineItemQuantity,
  removeLineItem,
} from "@/lib/commercetools";
import type { Cart } from "@commercetools/platform-sdk";

/**
 * Get or create a cart. The cart ID is persisted in an httpOnly cookie.
 * Returns the cart object.
 */
async function getOrCreateCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cart_id")?.value;

  if (cartId) {
    const cart = await getCartById(cartId);
    if (cart && cart.cartState === "Active") {
      return cart;
    }
  }

  // No cart or cart is no longer active — create a new one
  const cart = await createCart("USD");
  cookieStore.set("cart_id", cart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return cart;
}

export interface AddToCartResult {
  success: boolean;
  totalLineItemQuantity: number;
  error?: string;
}

/**
 * Server action: add a product to the cart.
 */
export async function addToCartAction(
  productId: string,
  variantId: number = 1,
  quantity: number = 1
): Promise<AddToCartResult> {
  try {
    const cart = await getOrCreateCart();
    const updatedCart = await addLineItem(
      cart.id,
      cart.version,
      productId,
      variantId,
      quantity
    );
    return {
      success: true,
      totalLineItemQuantity: updatedCart.totalLineItemQuantity ?? 0,
    };
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return {
      success: false,
      totalLineItemQuantity: 0,
      error: "Failed to add item to cart. Please try again.",
    };
  }
}

/**
 * Server action: get the current cart item count.
 */
export async function getCartItemCount(): Promise<number> {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cart_id")?.value;
    if (!cartId) return 0;

    const cart = await getCartById(cartId);
    if (!cart || cart.cartState !== "Active") return 0;

    return cart.totalLineItemQuantity ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Server action: get the full cart object for the cart page.
 */
export async function getCart(): Promise<Cart | null> {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cart_id")?.value;
    if (!cartId) return null;

    const cart = await getCartById(cartId);
    if (!cart || cart.cartState !== "Active") return null;

    return cart;
  } catch {
    return null;
  }
}

export interface CartUpdateResult {
  success: boolean;
  totalLineItemQuantity: number;
  error?: string;
}

/**
 * Server action: update line item quantity.
 */
export async function updateLineItemQuantityAction(
  lineItemId: string,
  quantity: number
): Promise<CartUpdateResult> {
  try {
    const cart = await getOrCreateCart();
    const updatedCart = await changeLineItemQuantity(
      cart.id,
      cart.version,
      lineItemId,
      quantity
    );
    return {
      success: true,
      totalLineItemQuantity: updatedCart.totalLineItemQuantity ?? 0,
    };
  } catch (error) {
    console.error("Failed to update line item quantity:", error);
    return {
      success: false,
      totalLineItemQuantity: 0,
      error: "Failed to update quantity. Please try again.",
    };
  }
}

/**
 * Server action: remove a line item from the cart.
 */
export async function removeLineItemAction(
  lineItemId: string
): Promise<CartUpdateResult> {
  try {
    const cart = await getOrCreateCart();
    const updatedCart = await removeLineItem(
      cart.id,
      cart.version,
      lineItemId
    );
    return {
      success: true,
      totalLineItemQuantity: updatedCart.totalLineItemQuantity ?? 0,
    };
  } catch (error) {
    console.error("Failed to remove line item:", error);
    return {
      success: false,
      totalLineItemQuantity: 0,
      error: "Failed to remove item. Please try again.",
    };
  }
}
