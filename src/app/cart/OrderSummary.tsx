"use client";

import React from "react";
import Link from "next/link";

interface OrderSummaryProps {
  totalPrice: {
    centAmount: number;
    fractionDigits: number;
    currencyCode: string;
  };
  lineItems: Array<{
    quantity: number;
  }>;
}

function formatPrice(centAmount: number, fractionDigits: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(centAmount / Math.pow(10, fractionDigits));
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ totalPrice, lineItems }) => {
  const itemCount = lineItems.reduce((s, i) => s + i.quantity, 0);
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Order Summary
      </h2>
      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {formatPrice(
              totalPrice.centAmount,
              totalPrice.fractionDigits,
              totalPrice.currencyCode
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>Shipping</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            Free
          </span>
        </div>
      </div>
      <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
        <div className="flex justify-between text-base font-semibold text-zinc-900 dark:text-zinc-50">
          <span>Total</span>
          <span>
            {formatPrice(
              totalPrice.centAmount,
              totalPrice.fractionDigits,
              totalPrice.currencyCode
            )}
          </span>
        </div>
      </div>
      <Link
        href="/checkout"
        className="btn-vibrant mt-6 block w-full rounded-lg py-3 text-center text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25"
      >
        Proceed to Checkout
      </Link>
      <Link
        href="/home"
        className="mt-3 block text-center text-sm text-violet-600 transition hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSummary;
