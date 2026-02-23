"use server";

import { cookies } from "next/headers";
import {
  getCartById,
  setCartAddresses,
  createOrderFromCart,
  type AddressInput,
} from "@/lib/commercetools";

export interface PlaceOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

/**
 * Server action: place an order.
 * 1. Sets shipping + billing addresses on cart
 * 2. Creates the order from the cart
 * 3. Clears the cart cookie (cart is now "Ordered")
 */
export async function placeOrderAction(
  shippingAddress: AddressInput,
  billingAddress: AddressInput,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  paymentMethod: string
): Promise<PlaceOrderResult> {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cart_id")?.value;

    if (!cartId) {
      return { success: false, error: "No cart found. Please add items to your cart first." };
    }

    const cart = await getCartById(cartId);
    if (!cart || cart.cartState !== "Active") {
      return { success: false, error: "Cart is no longer active. Please start a new order." };
    }

    if (cart.lineItems.length === 0) {
      return { success: false, error: "Your cart is empty." };
    }

    // Set addresses on the cart
    const updatedCart = await setCartAddresses(
      cart.id,
      cart.version,
      shippingAddress,
      billingAddress
    );

    // Create the order from the cart
    const order = await createOrderFromCart(updatedCart.id, updatedCart.version);

    // Clear the cart cookie (the cart is now in "Ordered" state)
    cookieStore.set("cart_id", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber ?? order.id,
    };
  } catch (error) {
    console.error("Failed to place order:", error);
    return {
      success: false,
      error: "Failed to place order. Please try again.",
    };
  }
}
