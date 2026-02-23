
import { getAllCategories } from "@/lib/commercetools";
import Link from "next/link";
import Image from "next/image";
import { getLocalizedString } from "@/lib/utils";

function getLocalizedSlug(slug?: Record<string, string>): string {
  if (!slug) return "";
  return slug["en-US"] || slug["en"] || Object.values(slug)[0] || "";
}

export const metadata = {
  title: "All Categories | MyStore",
  description: "Browse all product categories",
};

export default async function AllCategoriesPage() {
  const categories = await getAllCategories();

  // Only show root (top-level) categories
  const rootCategories = categories.filter((cat) => !cat.parent);

  // Count sub-categories per root category
  const subCategoryCountMap = new Map<string, number>();
  categories.forEach((cat) => {
    if (cat.parent?.id) {
      subCategoryCountMap.set(
        cat.parent.id,
        (subCategoryCountMap.get(cat.parent.id) || 0) + 1
      );
    }
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-violet-50/30 dark:from-zinc-950 dark:to-zinc-950">
      {/* Page header */}
      <section className="border-b border-violet-100 bg-linear-to-b from-violet-50/60 to-white py-12 dark:border-violet-900/30 dark:from-violet-950/20 dark:to-zinc-950">
        <div className="mx-auto max-w-7xl px-6">
          <nav className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            <Link
              href="/home"
              className="transition hover:text-violet-600 dark:hover:text-violet-400"
            >
              Home
            </Link>
            <span className="mx-2">›</span>
            <span className="text-zinc-900 dark:text-zinc-50">All Categories</span>
          </nav>
          <h1 className="text-4xl font-bold">
            <span className="text-gradient">Shop by Category</span>
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Browse all {rootCategories.length} categories
          </p>
        </div>
      </section>

      {/* Categories grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          {rootCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl">📭</div>
              <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                No categories found
              </h2>
              <Link
                href="/home"
                className="btn-vibrant mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:scale-105"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {rootCategories.map((category) => {
                const name = getLocalizedString(category.name);
                const description = getLocalizedString(category.description);
                const slug = getLocalizedSlug(category.slug);
                const subCount = subCategoryCountMap.get(category.id) || 0;
                const image = category.assets?.[0]?.sources?.[0]?.uri;

                return (
                  <Link
                    key={category.id}
                    href={`/category/${slug}`}
                    className="card-glow group flex flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm transition hover:border-violet-300 hover:shadow-lg hover:shadow-violet-200/40 dark:border-violet-900/30 dark:bg-zinc-900 dark:hover:border-violet-700 dark:hover:shadow-violet-900/20"
                  >
                    {/* Category image / icon */}
                    <div className="relative flex aspect-4/3 items-center justify-center bg-linear-to-br from-violet-100 to-purple-100 dark:from-violet-950/40 dark:to-purple-950/40">
                      {image ? (
                        <Image
                          src={image}
                          alt={name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
                            🛍️
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Category info */}
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="text-lg font-bold text-zinc-900 transition group-hover:text-violet-700 dark:text-zinc-50 dark:group-hover:text-violet-400">
                        {name}
                      </h2>
                      {description && (
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                          {description}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-4">
                        {subCount > 0 && (
                          <span className="text-xs text-zinc-400 dark:text-zinc-500">
                            {subCount} sub-{subCount === 1 ? "category" : "categories"}
                          </span>
                        )}
                        <span className="ml-auto text-sm font-medium text-violet-600 opacity-0 transition group-hover:opacity-100 dark:text-violet-400">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}