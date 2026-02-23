import Link from "next/link";
import { getStatusColor, getPaymentStatusColor, formatPrice } from "./utils";
import { OrderLineItem } from "./OrderLineItem";

import type { OrderType, OrderLineItemType } from "./OrderTypes";

interface OrderCardProps {
  order: OrderType;
}

export function OrderCard({ order }: OrderCardProps) {
  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const itemCount = order.lineItems.reduce((sum: number, li: OrderLineItemType) => sum + li.quantity, 0);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {/* Order header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Order</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {order.orderNumber ?? order.id.slice(0, 8) + "..."}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Placed on</p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{date}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {formatPrice(order.totalPrice.centAmount, order.totalPrice.fractionDigits, order.totalPrice.currencyCode)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${getStatusColor(order.orderState)}`}>
            {order.orderState}
          </span>
          <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${getPaymentStatusColor(order.paymentState ?? "Pending")}`}>
            {order.paymentState ?? "Pending"}
          </span>
        </div>
      </div>
      {/* Line items */}
      <div className="divide-y divide-zinc-100 px-6 dark:divide-zinc-800">
        {order.lineItems.slice(0, 3).map((li: OrderLineItemType) => (
          <OrderLineItem key={li.id} lineItem={li} />
        ))}
        {/* Show how many more items */}
        {order.lineItems.length > 3 && (
          <div className="py-3 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              + {order.lineItems.length - 3} more {order.lineItems.length - 3 === 1 ? "item" : "items"}
            </p>
          </div>
        )}
      </div>
      {/* Order footer */}
      <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
        <Link
          href={`/checkout/confirmation?orderId=${order.id}`}
          className="text-sm font-medium text-violet-600 transition hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
}
