
import { getCart } from "./actions";
import CartLineItems, { type CartData, type CartLineItemData } from "./CartLineItems";
import Link from "next/link";
import { getLocalizedString } from "@/lib/utils";

export default async function CartPage() {
  const cart = await getCart();

  // Transform commercetools cart into a simple serializable shape
  let cartData: CartData;

  if (!cart || cart.lineItems.length === 0) {
    cartData = {
      lineItems: [],
      totalPrice: { centAmount: 0, fractionDigits: 2, currencyCode: "USD" },
      totalLineItemQuantity: 0,
    };
  } else {
    const lineItems: CartLineItemData[] = cart.lineItems.map((li) => {
      const image = li.variant?.images?.[0]?.url ?? null;
      const price = li.price;

      // Determine if there's a discount on this line item
      const hasDiscount = !!price.discounted || (li.discountedPricePerQuantity && li.discountedPricePerQuantity.length > 0);

      // The effective unit price after discount
      let effectiveUnitPrice = {
        centAmount: price.value.centAmount,
        fractionDigits: price.value.fractionDigits,
        currencyCode: price.value.currencyCode,
      };
      let originalPrice: CartLineItemData["originalPrice"];

      if (price.discounted) {
        // Product discount applied at the price level
        originalPrice = {
          centAmount: price.value.centAmount,
          fractionDigits: price.value.fractionDigits,
          currencyCode: price.value.currencyCode,
        };
        effectiveUnitPrice = {
          centAmount: price.discounted.value.centAmount,
          fractionDigits: price.discounted.value.fractionDigits,
          currencyCode: price.discounted.value.currencyCode,
        };
      } else if (li.discountedPricePerQuantity && li.discountedPricePerQuantity.length > 0) {
        // Cart discount applied
        const discountedEntry = li.discountedPricePerQuantity[0];
        originalPrice = {
          centAmount: price.value.centAmount,
          fractionDigits: price.value.fractionDigits,
          currencyCode: price.value.currencyCode,
        };
        effectiveUnitPrice = {
          centAmount: discountedEntry.discountedPrice.value.centAmount,
          fractionDigits: discountedEntry.discountedPrice.value.fractionDigits,
          currencyCode: discountedEntry.discountedPrice.value.currencyCode,
        };
      }

      return {
        id: li.id,
        productId: li.productId,
        productSlug: getLocalizedString(
          li.productSlug as unknown as Record<string, string>
        ),
        name: getLocalizedString(li.name),
        imageUrl: image,
        quantity: li.quantity,
        price: effectiveUnitPrice,
        originalPrice,
        hasDiscount: !!hasDiscount,
        totalPrice: {
          centAmount: li.totalPrice.centAmount,
          fractionDigits: li.totalPrice.fractionDigits,
          currencyCode: li.totalPrice.currencyCode,
        },
      };
    });

    cartData = {
      lineItems,
      totalPrice: {
        centAmount: cart.totalPrice.centAmount,
        fractionDigits: cart.totalPrice.fractionDigits,
        currencyCode: cart.totalPrice.currencyCode,
      },
      totalLineItemQuantity: cart.totalLineItemQuantity ?? 0,
    };
  }

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
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            Shopping Cart
          </span>
        </nav>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Shopping Cart
        </h1>

        <div className="mt-8">
          <CartLineItems cart={cartData} />
        </div>
      </div>
    </main>
  );
}
