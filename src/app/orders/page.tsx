
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getOrdersByCustomerEmail } from "@/lib/commercetools";
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

function getStatusColor(status: string) {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300";
    case "Confirmed":
      return "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300";
    case "Complete":
      return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300";
    case "Cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300";
    default:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300";
  }
}

function getPaymentStatusColor(status: string) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300";
    case "Pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300";
    case "Failed":
      return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300";
    default:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300";
  }
}

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const customerEmail = cookieStore.get("customer_email")?.value;

  if (!customerEmail) {
    redirect("/login");
  }

  const { results: orders, total } =
    await getOrdersByCustomerEmail(customerEmail);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-6 py-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                My Orders
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {total} {total === 1 ? "order" : "orders"} placed
              </p>
            </div>
            <Link
              href="/home"
              className="btn-vibrant inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="mt-16 flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-10 w-10 text-zinc-400 dark:text-zinc-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                No orders yet
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Start shopping to see your orders here.
              </p>
              <Link
                href="/home"
                className="btn-vibrant mt-6 inline-flex items-center rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition hover:scale-105"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {orders.map((order) => {
                const date = new Date(order.createdAt).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                );
                const itemCount = order.lineItems.reduce(
                  (sum, li) => sum + li.quantity,
                  0
                );

                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {/* Order header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Order
                          </p>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            {order.orderNumber ?? order.id.slice(0, 8) + "..."}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Placed on
                          </p>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            {date}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Total
                          </p>
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            {formatPrice(
                              order.totalPrice.centAmount,
                              order.totalPrice.fractionDigits,
                              order.totalPrice.currencyCode
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${getStatusColor(order.orderState)}`}
                        >
                          {order.orderState}
                        </span>
                        <span
                          className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${getPaymentStatusColor(order.paymentState ?? "Pending")}`}
                        >
                          {order.paymentState ?? "Pending"}
                        </span>
                      </div>
                    </div>

                    {/* Line items */}
                    <div className="divide-y divide-zinc-100 px-6 dark:divide-zinc-800">
                      {order.lineItems.slice(0, 3).map((li) => {
                        const image =
                          li.variant?.images?.[0]?.url ?? null;
                        return (
                          <div
                            key={li.id}
                            className="flex items-center gap-4 py-4"
                          >
                            {/* Product image */}
                            {image ? (
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                                <Image
                                  src={image}
                                  alt={getLocalizedString(li.name)}
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
                                {getLocalizedString(li.name)}
                              </p>
                              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Qty: {li.quantity} &times;{" "}
                                {formatPrice(
                                  li.price.value.centAmount,
                                  li.price.value.fractionDigits,
                                  li.price.value.currencyCode
                                )}
                              </p>
                            </div>

                            {/* Line total */}
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                              {formatPrice(
                                li.totalPrice.centAmount,
                                li.totalPrice.fractionDigits,
                                li.totalPrice.currencyCode
                              )}
                            </p>
                          </div>
                        );
                      })}

                      {/* Show how many more items */}
                      {order.lineItems.length > 3 && (
                        <div className="py-3 text-center">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            + {order.lineItems.length - 3} more{" "}
                            {order.lineItems.length - 3 === 1
                              ? "item"
                              : "items"}
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
              })}
            </div>
          )}
        </div>
      </main>
  );
}
