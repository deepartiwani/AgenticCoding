"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import QuantityControls from "./QuantityControls";
import OrderSummary from "./OrderSummary";
import EmptyCart from "./EmptyCart";
import {
  updateLineItemQuantityAction,
  removeLineItemAction,
} from "@/app/cart/actions";
import { useRouter } from "next/navigation";

function formatPrice(centAmount: number, fractionDigits: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(centAmount / Math.pow(10, fractionDigits));
}

export interface CartLineItemData {
  id: string;
  productId: string;
  productSlug: string;
  name: string;
  imageUrl: string | null;
  quantity: number;
  price: {
    centAmount: number;
    fractionDigits: number;
    currencyCode: string;
  };
  /** Original (non-discounted) unit price, present only when a discount applies */
  originalPrice?: {
    centAmount: number;
    fractionDigits: number;
    currencyCode: string;
  };
  hasDiscount: boolean;
  totalPrice: {
    centAmount: number;
    fractionDigits: number;
    currencyCode: string;
  };
}

export interface CartData {
  lineItems: CartLineItemData[];
  totalPrice: {
    centAmount: number;
    fractionDigits: number;
    currencyCode: string;
  };
  totalLineItemQuantity: number;
}

export default function CartLineItems({ cart }: { cart: CartData }) {
  function renderUnitPrice(item: CartLineItemData) {
    if (item.hasDiscount && item.originalPrice) {
      return (
        <span className="flex items-center gap-2">
          <span className="text-zinc-400 line-through dark:text-zinc-500">
            {formatPrice(
              item.originalPrice.centAmount,
              item.originalPrice.fractionDigits,
              item.originalPrice.currencyCode
            )}
          </span>
          <span className="font-semibold text-red-600 dark:text-red-400">
            {formatPrice(
              item.price.centAmount,
              item.price.fractionDigits,
              item.price.currencyCode
            )}
          </span>
          <span className="text-xs">each</span>
        </span>
      );
    }
    return (
      <span className="text-zinc-500 dark:text-zinc-400">
        {formatPrice(
          item.price.centAmount,
          item.price.fractionDigits,
          item.price.currencyCode
        )} each
      </span>
    );
  }
  const [lineItems, setLineItems] = useState(cart.lineItems);
  const [totalPrice, setTotalPrice] = useState(cart.totalPrice);
  const { setItemCount } = useCart();
  const [isPending, startTransition] = useTransition();
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const router = useRouter();

  const handleQuantityChange = (lineItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoadingItemId(lineItemId);

    startTransition(async () => {
      const result = await updateLineItemQuantityAction(lineItemId, newQuantity);
      if (result.success) {
        setItemCount(result.totalLineItemQuantity);
        // Re-fetch cart data by refreshing the server component
        router.refresh();
        // Optimistically update the UI
        setLineItems((prev) =>
          prev.map((item) =>
            item.id === lineItemId
              ? {
                  ...item,
                  quantity: newQuantity,
                  totalPrice: {
                    ...item.totalPrice,
                    centAmount: item.price.centAmount * newQuantity,
                  },
                }
              : item
          )
        );
        // Update total
        setTotalPrice((prev) => {
          const diff = lineItems.find((i) => i.id === lineItemId);
          if (!diff) return prev;
          const oldTotal = diff.price.centAmount * diff.quantity;
          const newTotal = diff.price.centAmount * newQuantity;
          return { ...prev, centAmount: prev.centAmount - oldTotal + newTotal };
        });
      }
      setLoadingItemId(null);
    });
  };

  const handleRemove = (lineItemId: string) => {
    setLoadingItemId(lineItemId);

    startTransition(async () => {
      const result = await removeLineItemAction(lineItemId);
      if (result.success) {
        setItemCount(result.totalLineItemQuantity);
        const removedItem = lineItems.find((i) => i.id === lineItemId);
        setLineItems((prev) => prev.filter((item) => item.id !== lineItemId));
        if (removedItem) {
          setTotalPrice((prev) => ({
            ...prev,
            centAmount: prev.centAmount - removedItem.totalPrice.centAmount,
          }));
        }
        router.refresh();
      }
      setLoadingItemId(null);
    });
  };

  if (lineItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
      {/* Line Items */}
      <div className="lg:col-span-8">
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {lineItems.map((item) => {
            const isLoading = loadingItemId === item.id && isPending;
            return (
              <div
                key={item.id}
                className={`flex gap-4 py-6 transition ${isLoading ? "opacity-50" : ""}`}
              >
                {/* Product Image */}
                <Link
                  href={`/product/${item.productSlug}`}
                  className="shrink-0"
                >
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 sm:h-32 sm:w-32">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-8 w-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <Link
                        href={`/product/${item.productSlug}`}
                        className="text-sm font-medium text-zinc-900 transition hover:text-violet-600 dark:text-zinc-50 dark:hover:text-violet-400 sm:text-base"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm">{renderUnitPrice(item)}</p>
                    </div>
                    <p className={`text-sm font-semibold sm:text-base ${
                      item.hasDiscount
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-900 dark:text-zinc-50"
                    }`}>
                      {formatPrice(
                        item.totalPrice.centAmount,
                        item.totalPrice.fractionDigits,
                        item.totalPrice.currencyCode
                      )}
                    </p>
                  </div>

                  {/* Quantity Controls + Remove */}
                  <div className="mt-3 flex items-center justify-between">
                    <QuantityControls
                      quantity={item.quantity}
                      onDecrease={() => handleQuantityChange(item.id, item.quantity - 1)}
                      onIncrease={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={isLoading}
                    />

                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={isLoading}
                      className="text-sm font-medium text-red-500 transition hover:text-red-700 disabled:opacity-40 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-8 lg:col-span-4 lg:mt-0">
        <OrderSummary totalPrice={totalPrice} lineItems={lineItems} />
      </div>
    </div>
  );
}
