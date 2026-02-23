
import { redirect } from "next/navigation";
import { getCart } from "@/app/cart/actions";
import CheckoutForm from "./CheckoutForm";
import Link from "next/link";
import { getLocalizedString } from "@/lib/utils";

export interface CheckoutLineItem {
  id: string;
  name: string;
  imageUrl: string | null;
  quantity: number;
  price: {
    centAmount: number;
    fractionDigits: number;
    currencyCode: string;
  };
  totalPrice: {
    centAmount: number;
    fractionDigits: number;
    currencyCode: string;
  };
}

export interface CheckoutCartData {
  lineItems: CheckoutLineItem[];
  totalPrice: {
    centAmount: number;
    fractionDigits: number;
    currencyCode: string;
  };
  totalLineItemQuantity: number;
}

export default async function CheckoutPage() {
  const cart = await getCart();

  if (!cart || cart.lineItems.length === 0) {
    redirect("/cart");
  }

  const lineItems: CheckoutLineItem[] = cart.lineItems.map((li) => ({
    id: li.id,
    name: getLocalizedString(li.name),
    imageUrl: li.variant?.images?.[0]?.url ?? null,
    quantity: li.quantity,
    price: {
      centAmount: li.price.value.centAmount,
      fractionDigits: li.price.value.fractionDigits,
      currencyCode: li.price.value.currencyCode,
    },
    totalPrice: {
      centAmount: li.totalPrice.centAmount,
      fractionDigits: li.totalPrice.fractionDigits,
      currencyCode: li.totalPrice.currencyCode,
    },
  }));

  const cartData: CheckoutCartData = {
    lineItems,
    totalPrice: {
      centAmount: cart.totalPrice.centAmount,
      fractionDigits: cart.totalPrice.fractionDigits,
      currencyCode: cart.totalPrice.currencyCode,
    },
    totalLineItemQuantity: cart.totalLineItemQuantity ?? 0,
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/home"
            className="transition hover:text-violet-600 dark:hover:text-violet-400"
          >
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/cart"
            className="transition hover:text-violet-600 dark:hover:text-violet-400"
          >
            Cart
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            Checkout
          </span>
        </nav>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Checkout
        </h1>

        <div className="mt-8">
          <CheckoutForm cart={cartData} />
        </div>
      </div>
    </main>
  );
}
