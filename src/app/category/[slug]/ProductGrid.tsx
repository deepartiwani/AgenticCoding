"use client";


import type { ProductProjection } from "@commercetools/platform-sdk";
import ProductCard from "@/app/components/ProductCard";


interface ProductGridProps {
  products: ProductProjection[];
}

function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          cardClassName="card-glow flex flex-col border-violet-100 bg-white hover:border-violet-300 hover:shadow-lg dark:border-violet-900/30 dark:bg-zinc-900 dark:hover:border-violet-700"
          contentClassName="flex-1"
        />
      ))}
    </div>
  );
}

export default ProductGrid;
