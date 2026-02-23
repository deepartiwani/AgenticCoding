"use client";


import type { ProductProjection } from "@commercetools/platform-sdk";
import ProductCard from "@/app/components/ProductCard";


interface FeaturedProductsProps {
  products: ProductProjection[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section id="featured" className="py-20 bg-linear-to-b from-white to-violet-50/50 dark:from-zinc-950 dark:to-violet-950/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-500 dark:text-violet-400">
              Featured Products
            </h3>
            <p className="mt-2 text-3xl font-bold">
              <span className="text-gradient">Handpicked</span>{" "}
              <span className="text-zinc-900 dark:text-zinc-50">for you</span>
            </p>
          </div>
          <a href="#" className="hidden text-sm font-medium text-violet-600 transition hover:text-pink-500 md:block dark:text-violet-400">
            View all →
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cardClassName="card-industrial border-[#b0b6bb] bg-[#f5f6f7] hover:shadow-lg hover:border-[#7a8288] dark:border-[#353b40] dark:bg-[#23272a] dark:hover:border-[#7a8288]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
