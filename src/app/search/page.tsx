import { searchProducts } from "@/lib/commercetools";
import Link from "next/link";
import SearchResults from "./SearchResults";
import SearchFilters from "./SearchFilters";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string; sort?: string; price?: string }>;
}

const SORT_OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Price: Low to High", value: "price asc" },
  { label: "Price: High to Low", value: "price desc" },
  { label: "Name: A–Z", value: "name.en-US asc" },
  { label: "Name: Z–A", value: "name.en-US desc" },
];

const PAGE_SIZE = 20;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", page = "1", sort = "", price = "" } = await searchParams;
  const query = q.trim();
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const offset = (currentPage - 1) * PAGE_SIZE;
  const currentSort = sort;
  const currentPriceRange = price;

  // If no query, show empty state
  if (!query) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white to-violet-50/30 dark:from-zinc-950 dark:to-zinc-950">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="text-6xl">🔍</div>
          <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Search Products
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Enter a search term in the search bar above to find products.
          </p>
          <Link
            href="/home"
            className="btn-vibrant mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:scale-105"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Parse price range
  let priceMin: number | undefined;
  let priceMax: number | undefined;
  if (currentPriceRange) {
    const [minStr, maxStr] = currentPriceRange.split("-");
    if (minStr) priceMin = parseInt(minStr, 10);
    if (maxStr) priceMax = parseInt(maxStr, 10);
  }

  const { results, total } = await searchProducts(
    query,
    PAGE_SIZE,
    offset,
    currentSort || undefined,
    false,
    priceMin,
    priceMax
  );
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-violet-50/30 dark:from-zinc-950 dark:to-zinc-950">
      {/* Header */}
      <section className="border-b border-violet-100 bg-linear-to-b from-violet-50/60 to-white py-12 dark:border-violet-900/30 dark:from-violet-950/20 dark:to-zinc-950">
        <div className="mx-auto max-w-7xl px-6">
          {/* Breadcrumb */}
          <nav className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            <Link
              href="/home"
              className="transition hover:text-violet-600 dark:hover:text-violet-400"
            >
              Home
            </Link>
            <span className="mx-2">›</span>
            <span className="text-zinc-900 dark:text-zinc-50">Search</span>
          </nav>

          <h1 className="text-4xl font-bold">
            <span className="text-gradient">
              Results for &ldquo;{query}&rdquo;
            </span>
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {total} {total === 1 ? "product" : "products"} found
          </p>
        </div>
      </section>

      {/* Main content: sidebar + products */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          {total === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="text-6xl">😕</div>
              <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                No results found
              </h2>
              <p className="mt-2 max-w-md text-zinc-500 dark:text-zinc-400">
                We couldn&apos;t find any products matching &ldquo;{query}&rdquo;. Try a different search term or browse our categories.
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/categories"
                  className="btn-vibrant inline-block rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:scale-105"
                >
                  Browse Categories
                </Link>
                <Link
                  href="/home"
                  className="inline-block rounded-full border-2 border-violet-200 px-6 py-3 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/30"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Filters sidebar */}
              <SearchFilters
                query={query}
                currentSort={currentSort}
                currentPriceRange={currentPriceRange}
                sortOptions={SORT_OPTIONS}
                totalProducts={total}
              />

              {/* Products area */}
              <div className="min-w-0 flex-1">
                <SearchResults products={results} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {currentPage > 1 && (
                      <Link
                        href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}${currentSort ? `&sort=${encodeURIComponent(currentSort)}` : ""}${currentPriceRange ? `&price=${currentPriceRange}` : ""}`}
                        className="rounded-lg border border-violet-200 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-950/50"
                      >
                        ← Previous
                      </Link>
                    )}
                    <span className="px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    {currentPage < totalPages && (
                      <Link
                        href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}${currentSort ? `&sort=${encodeURIComponent(currentSort)}` : ""}${currentPriceRange ? `&price=${currentPriceRange}` : ""}`}
                        className="rounded-lg border border-violet-200 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-950/50"
                      >
                        Next →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
