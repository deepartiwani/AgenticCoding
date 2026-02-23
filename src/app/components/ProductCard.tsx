"use client";

import type { ProductProjection } from "@commercetools/platform-sdk";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { useState } from "react";

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

interface ProductCardProps {
  product: ProductProjection;
  cardClassName?: string;
  contentClassName?: string;
}

export default function ProductCard({ product, cardClassName = "", contentClassName = "" }: ProductCardProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const name = getProductName(product);
  const image = getProductImage(product);
  const price = getProductPrice(product);
  const description = getProductDescription(product);
  const slug = getProductSlug(product);
  const variantId = product.masterVariant.id;

  const handleAddToCart = async (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    setAdded(false);
    const success = await addToCart(product.id, variantId);
    setAdding(false);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <Link
      href={`/product/${slug}`}
      className={`group cursor-pointer overflow-hidden rounded-2xl border transition ${cardClassName}`}
      key={product.id}
    >
      <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl text-zinc-300 dark:text-zinc-600">
            📦
          </div>
        )}
      </div>
      <div className={`p-6 flex flex-col flex-1 ${contentClassName}`}>
        <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 truncate">{name}</h4>
        <p className="mt-2 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">{description || "\u00A0"}</p>
        <p className="mt-3 mb-4 text-lg font-bold text-gradient">{price || "\u2014"}</p>
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className={`mt-auto w-full rounded-full border-2 py-2.5 text-sm font-medium transition ${
            added
              ? "border-green-400 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-950/30 dark:text-green-400"
              : "border-violet-200 text-violet-700 hover:border-violet-600 hover:bg-violet-600 hover:text-white hover:shadow-md hover:shadow-purple-500/20 dark:border-violet-800 dark:text-violet-300 dark:hover:border-violet-500 dark:hover:bg-violet-500 dark:hover:text-white"
          } disabled:cursor-wait disabled:opacity-60`}
        >
          {adding ? "Adding..." : added ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}
