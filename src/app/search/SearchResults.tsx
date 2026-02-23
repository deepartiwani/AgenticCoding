"use client";

import { useState } from "react";
import type { ProductProjection } from "@commercetools/platform-sdk";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";

import { getLocalizedString } from "@/lib/utils";

function getProductName(product: ProductProjection): string {
  return getLocalizedString(product.name) || "Untitled";
}

function getProductDescription(product: ProductProjection): string | undefined {
  if (!product.description) return undefined;
  return getLocalizedString(product.description);
}

function getProductImage(product: ProductProjection): string | undefined {
  return product.masterVariant.images?.[0]?.url;
}

function getProductSlug(product: ProductProjection): string {
  return getLocalizedString(product.slug) || product.id;
}

function getProductPrice(product: ProductProjection): string | undefined {
  const price = product.masterVariant.price ?? product.masterVariant.prices?.[0];
  if (!price) return undefined;
  const amount = price.value.centAmount;
  const fractionDigits = price.value.fractionDigits;
  const currencyCode = price.value.currencyCode;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount / Math.pow(10, fractionDigits));
}

interface SearchResultsProps {
  products: ProductProjection[];
}

export default function SearchResults({ products }: SearchResultsProps) {
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = async (
    e: React.MouseEvent,
    productId: string,
    variantId: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingId(productId);
    setAddedId(null);
    const success = await addToCart(productId, variantId);
    setAddingId(null);
    if (success) {
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 1500);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const name = getProductName(product);
        const image = getProductImage(product);
        const price = getProductPrice(product);
        const description = getProductDescription(product);
        const slug = getProductSlug(product);
        const variantId = product.masterVariant.id;
        const isAdding = addingId === product.id;
        const justAdded = addedId === product.id;

        return (
          <Link
            href={`/product/${slug}`}
            key={product.id}
            className="card-glow group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white transition hover:border-violet-300 hover:shadow-lg dark:border-violet-900/30 dark:bg-zinc-900 dark:hover:border-violet-700"
          >
            <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl text-zinc-300 dark:text-zinc-600">
                  📦
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h4 className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
                {name}
              </h4>
              <p className="mt-2 h-10 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">
                {description || "\u00A0"}
              </p>
              <p className="mt-3 mb-4 text-lg font-bold text-gradient">
                {price || "\u2014"}
              </p>
              <button
                onClick={(e) => handleAddToCart(e, product.id, variantId)}
                disabled={isAdding}
                className={`mt-auto w-full rounded-full border-2 py-2.5 text-sm font-medium transition ${
                  justAdded
                    ? "border-green-400 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-950/30 dark:text-green-400"
                    : "border-violet-200 text-violet-700 hover:border-violet-600 hover:bg-violet-600 hover:text-white hover:shadow-md hover:shadow-purple-500/20 dark:border-violet-800 dark:text-violet-300 dark:hover:border-violet-500 dark:hover:bg-violet-500 dark:hover:text-white"
                } disabled:cursor-wait disabled:opacity-60`}
              >
                {isAdding ? "Adding..." : justAdded ? "✓ Added!" : "Add to Cart"}
              </button>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
