import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/commercetools";
import { getLocalizedString } from "@/lib/utils";

function formatPrice(
  centAmount: number,
  fractionDigits: number,
  currencyCode: string
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(centAmount / Math.pow(10, fractionDigits));
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) {
    redirect("/home");
  }

  const order = await getOrderById(orderId);

  if (!order) {
    redirect("/home");
  }

  const shippingAddress = order.shippingAddress;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-10 w-10 text-green-600 dark:text-green-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mt-6 text-center text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Order Placed Successfully!
        </h1>
        <p className="mt-2 text-center text-zinc-500 dark:text-zinc-400">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Order Info Card */}
        <div className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Order ID
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50 break-all">
                {order.orderNumber ?? order.id}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Date
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Order Status
              </p>
              <span className="mt-1 inline-block rounded-full bg-violet-100 px-3 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                {order.orderState}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Payment Status
              </p>
              <span className="mt-1 inline-block rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                {order.paymentState ?? "Pending"}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-700">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Shipping To
              </p>
              <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {shippingAddress.streetName}
                {shippingAddress.additionalStreetInfo &&
                  `, ${shippingAddress.additionalStreetInfo}`}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {shippingAddress.city}
                {shippingAddress.region && `, ${shippingAddress.region}`}{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </div>
          )}

          {/* Order Items */}
          <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-700">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Items Ordered
            </p>
            <div className="mt-3 divide-y divide-zinc-200 dark:divide-zinc-700">
              {order.lineItems.map((li) => (
                <div
                  key={li.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {getLocalizedString(li.name)}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Qty: {li.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {formatPrice(
                      li.totalPrice.centAmount,
                      li.totalPrice.fractionDigits,
                      li.totalPrice.currencyCode
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
            <div className="flex justify-between text-lg font-bold text-zinc-900 dark:text-zinc-50">
              <span>Total</span>
              <span>
                {formatPrice(
                  order.totalPrice.centAmount,
                  order.totalPrice.fractionDigits,
                  order.totalPrice.currencyCode
                )}
              </span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/home"
            className="btn-vibrant inline-flex items-center rounded-lg px-8 py-3 text-sm font-semibold text-white transition hover:scale-105"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
