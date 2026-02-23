import Image from "next/image";
import Spinner from "@/app/components/Spinner";
import type { CheckoutCartData, CheckoutLineItem } from "./page";

interface OrderSummarySectionProps {
  cart: CheckoutCartData;
  error: string | null;
  isPending: boolean;
  handlePlaceOrder: () => void;
}

function formatPrice(centAmount: number, fractionDigits: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(centAmount / Math.pow(10, fractionDigits));
}

const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({ cart, error, isPending, handlePlaceOrder }) => (
  <div className="sticky top-6 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Order Summary</h2>
    {/* Line items */}
    <div className="mt-4 max-h-80 space-y-4 overflow-y-auto pr-1">
      {cart.lineItems.map((item: CheckoutLineItem) => (
        <div key={item.id} className="flex gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="64px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 line-clamp-1">{item.name}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Qty: {item.quantity}</span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {formatPrice(item.totalPrice.centAmount, item.totalPrice.fractionDigits, item.totalPrice.currencyCode)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* Totals */}
    <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
      <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
        <span>Subtotal ({cart.totalLineItemQuantity} {cart.totalLineItemQuantity === 1 ? "item" : "items"})</span>
        <span className="font-medium text-zinc-900 dark:text-zinc-50">
          {formatPrice(cart.totalPrice.centAmount, cart.totalPrice.fractionDigits, cart.totalPrice.currencyCode)}
        </span>
      </div>
      <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
        <span>Shipping</span>
        <span className="font-medium text-green-600 dark:text-green-400">Free</span>
      </div>
      <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
        <span>Tax</span>
        <span className="font-medium text-zinc-500 dark:text-zinc-400">Calculated at order</span>
      </div>
    </div>
    <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
      <div className="flex justify-between text-lg font-bold text-zinc-900 dark:text-zinc-50">
        <span>Total</span>
        <span>
          {formatPrice(cart.totalPrice.centAmount, cart.totalPrice.fractionDigits, cart.totalPrice.currencyCode)}
        </span>
      </div>
    </div>
    {/* Error message */}
    {error && (
      <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
        {error}
      </div>
    )}
    {/* Place Order Button */}
    <button
      onClick={handlePlaceOrder}
      disabled={isPending}
      className="btn-vibrant mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 disabled:pointer-events-none disabled:opacity-60"
    >
      {isPending ? (
        <>
          <Spinner size="sm" fullPage={false} />
          Placing Order…
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          Place Order
        </>
      )}
    </button>
    <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
      By placing your order, you agree to our Terms of Service and Privacy Policy.
    </p>
  </div>
);

export default OrderSummarySection;
