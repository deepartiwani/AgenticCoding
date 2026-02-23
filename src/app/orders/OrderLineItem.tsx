
import Image from "next/image";
import { getLocalizedString, formatPrice } from "./utils";


import type { OrderLineItemType } from "./OrderTypes";

interface OrderLineItemProps {
  lineItem: OrderLineItemType;
}

export function OrderLineItem({ lineItem }: OrderLineItemProps) {
  const image = lineItem.variant?.images?.[0]?.url ?? null;
  return (
    <div key={lineItem.id} className="flex items-center gap-4 py-4">
      {/* Product image */}
      {image ? (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
          <Image
            src={image}
            alt={getLocalizedString(lineItem.name)}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 text-zinc-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5"
            />
          </svg>
        </div>
      )}
      {/* Product details */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {getLocalizedString(lineItem.name)}
        </p>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          Qty: {lineItem.quantity} &times; {formatPrice(
            lineItem.price.value.centAmount,
            lineItem.price.value.fractionDigits,
            lineItem.price.value.currencyCode
          )}
        </p>
      </div>
      {/* Line total */}
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {formatPrice(
          lineItem.totalPrice.centAmount,
          lineItem.totalPrice.fractionDigits,
          lineItem.totalPrice.currencyCode
        )}
      </p>
    </div>
  );
}
