import { apiRoot } from "@/lib/commercetools";
import { getLocalizedString } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface RelatedProductsCarouselProps {
  productIds: string[];
}

async function fetchProductsByIds(ids: string[]) {
  if (!ids.length) return [];
  const response = await apiRoot
    .productProjections()
    .get({
      queryArgs: {
        // Use the 'where' predicate with the 'in' operator
        where: `id in ("${ids.join('","')}")`,
        limit: ids.length,
      },
    })
  .execute();
  return response.body.results;
}

export default async function RelatedProductsCarousel({ productIds }: RelatedProductsCarouselProps) {
  const products = await fetchProductsByIds(productIds);
  if (!products.length) return null;

  return (
    <div className="mt-12">
      <h2 className="text-lg font-semibold text-violet-600 dark:text-violet-400 mb-4">Related Products</h2>
      <div className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory">
        {products.map((product) => {
          const name = getLocalizedString(product.name) || "Untitled";
          const image = product.masterVariant.images?.[0]?.url;
          const slug = product.slug["en-US"] || Object.values(product.slug)[0] || "";
          return (
            <Link
              key={product.id}
              href={`/product/${slug}`}
              className="min-w-[200px] max-w-[220px] bg-white dark:bg-zinc-900 rounded-lg shadow card-glow p-4 flex flex-col items-center snap-center hover:scale-105 transition-transform"
            >
              {image && (
                <Image
                  src={image}
                  alt={name}
                  width={160}
                  height={160}
                  className="rounded mb-2 object-contain bg-zinc-100 dark:bg-zinc-800"
                />
              )}
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100 text-center line-clamp-2">
                {name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
