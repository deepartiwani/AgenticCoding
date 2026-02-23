import { apiRoot, getDefaultDistributionChannelId } from "@/lib/commercetools";
import type { ProductProjection } from "@commercetools/platform-sdk";
import Link from "next/link";
import ProductImages from "./ProductImages";
import AddToCartButton from "./AddToCartButton";

import { getLocalizedString } from "@/lib/utils";

async function getProductBySlug(slug: string): Promise<ProductProjection | null> {
  try {
    const channelId = await getDefaultDistributionChannelId();
    const response = await apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: [`slug.en-US:"${slug}"`],
          limit: 1,
          priceChannel: channelId,
          priceCurrency: "USD",
        },
      })
      .execute();
    return response.body.results[0] || null;
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Product Not Found</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  const name = getLocalizedString(product.name) || "Untitled";
  const description = product.description ? getLocalizedString(product.description) : undefined;
  const images = product.masterVariant.images || [];
  // Use the resolved price (from priceChannel query) or fall back to embedded prices
  const price = product.masterVariant.price ?? product.masterVariant.prices?.[0];

  const formatMoney = (centAmount: number, fractionDigits: number, currencyCode: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode })
      .format(centAmount / Math.pow(10, fractionDigits));

  let formattedPrice: string | undefined;
  let formattedOriginalPrice: string | undefined;
  let hasDiscount = false;

  if (price) {
    const { centAmount, fractionDigits, currencyCode } = price.value;
    formattedPrice = formatMoney(centAmount, fractionDigits, currencyCode);

    // Check for product discount (discounted field on the price)
    if (price.discounted) {
      formattedOriginalPrice = formattedPrice;
      formattedPrice = formatMoney(
        price.discounted.value.centAmount,
        price.discounted.value.fractionDigits,
        price.discounted.value.currencyCode
      );
      hasDiscount = true;
    }
  }

  const attributes = product.masterVariant.attributes || [];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Back link */}
        <Link
          href="/home"
          className="inline-flex items-center text-sm font-medium text-violet-600 transition hover:text-pink-500 dark:text-violet-400"
        >
          ← Back to Products
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Product Images */}
          <ProductImages images={images} name={name} />

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              {name}
            </h1>

            {formattedPrice && (
              <div className="mt-4 flex items-center gap-3">
                {hasDiscount && formattedOriginalPrice && (
                  <span className="text-2xl text-zinc-400 line-through dark:text-zinc-500">
                    {formattedOriginalPrice}
                  </span>
                )}
                <span
                  className={`text-3xl font-bold ${
                    hasDiscount
                      ? "text-red-600 dark:text-red-400"
                      : "text-gradient"
                  }`}
                >
                  {formattedPrice}
                </span>
                {hasDiscount && (
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    Sale
                  </span>
                )}
              </div>
            )}

            {description && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-violet-500 dark:text-violet-400">
                  Description
                </h2>
                <p className="mt-2 text-zinc-600 leading-relaxed dark:text-zinc-400">
                  {description}
                </p>
              </div>
            )}

            {/* Attributes */}
            {attributes.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-violet-500 dark:text-violet-400">
                  Details
                </h2>
                <dl className="mt-3 space-y-2">
                  {attributes.map((attr) => (
                    <div key={attr.name} className="flex gap-3 text-sm">
                      <dt className="font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                        {attr.name.replace(/-/g, " ")}:
                      </dt>
                      <dd className="text-zinc-500 dark:text-zinc-400">
                        {typeof attr.value === "object" && attr.value?.label
                          ? attr.value.label
                          : String(attr.value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Add to Cart button */}
            <AddToCartButton
              productId={product.id}
              variantId={product.masterVariant.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}