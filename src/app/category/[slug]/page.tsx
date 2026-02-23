import {
  getAllCategories,
  getProductsByCategory,
  getProductsByCategories,
} from "@/lib/commercetools";

import Link from "next/link";
import ProductGrid from "./ProductGrid";
import CategoryFilters from "./CategoryFilters";
import {
  getLocalizedString,
  getLocalizedSlug,
  buildBreadcrumbs,
  buildSubCategoryOptions,
  parsePriceRange,
} from "@/lib/categoryUtils";

const SORT_OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Price: Low to High", value: "price asc" },
  { label: "Price: High to Low", value: "price desc" },
  { label: "Name: A–Z", value: "name.en-US asc" },
  { label: "Name: Z–A", value: "name.en-US desc" },
];

const PAGE_SIZE = 20;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const subcategoryId =
    typeof resolvedSearchParams.subcategory === "string"
      ? resolvedSearchParams.subcategory
      : null;
  const currentSort =
    typeof resolvedSearchParams.sort === "string"
      ? resolvedSearchParams.sort
      : "";
  const currentPriceRange =
    typeof resolvedSearchParams.price === "string"
      ? resolvedSearchParams.price
      : "";
  const currentPage =
    typeof resolvedSearchParams.page === "string"
      ? Math.max(1, parseInt(resolvedSearchParams.page, 10) || 1)
      : 1;
  const offset = (currentPage - 1) * PAGE_SIZE;

  const allCategories = await getAllCategories();

  // Find the current category by slug
  const category = allCategories.find(
    (cat) => getLocalizedSlug(cat.slug) === slug
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white to-violet-50/30 dark:from-zinc-950 dark:to-zinc-950">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="text-6xl">🔍</div>
          <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Category not found
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            The category &ldquo;{slug}&rdquo; does not exist.
          </p>
          <Link
            href="/categories"
            className="btn-vibrant mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:scale-105"
          >
            Browse All Categories
          </Link>
        </div>
      </div>
    );
  }

  const categoryName = getLocalizedString(category.name);
  const categoryDescription = getLocalizedString(category.description);

  // Find sub-categories (children of current category)
  const subCategories = allCategories.filter(
    (cat) => cat.parent?.id === category.id
  );

  const hasSubCategories = subCategories.length > 0;

  // Build breadcrumb from ancestors
  const breadcrumbs = buildBreadcrumbs(category, allCategories);

  // Build sub-category options for filters
  const subCategoryOptions = buildSubCategoryOptions(subCategories);

  // Parse price range from query param
  const { priceMin, priceMax } = parsePriceRange(currentPriceRange);

  // Fetch products based on category structure
  let products: Awaited<ReturnType<typeof getProductsByCategory>>["results"];
  let total: number;

  if (hasSubCategories) {
    // Category has sub-categories: fetch products from all sub-category IDs
    const allCategoryIds = [
      category.id,
      ...subCategories.map((sc) => sc.id),
    ];
    const result = await getProductsByCategories(
      allCategoryIds,
      PAGE_SIZE,
      offset,
      currentSort || undefined,
      subcategoryId || undefined,
      priceMin,
      priceMax
    );
    products = result.results;
    total = result.total;
  } else {
    // No sub-categories: fetch products for this category directly
    const result = await getProductsByCategory(
      category.id,
      PAGE_SIZE,
      offset,
      currentSort || undefined,
      priceMin,
      priceMax
    );
    products = result.results;
    total = result.total;
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Determine the active sub-category name for display
  const activeSubCategoryName = subcategoryId
    ? subCategoryOptions.find((sc) => sc.id === subcategoryId)?.name
    : null;

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-violet-50/30 dark:from-zinc-950 dark:to-zinc-950">
      {/* Page header with breadcrumb */}
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
            <Link
              href="/categories"
              className="transition hover:text-violet-600 dark:hover:text-violet-400"
            >
              All Categories
            </Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.slug}>
                <span className="mx-2">›</span>
                <Link
                  href={`/category/${crumb.slug}`}
                  className="transition hover:text-violet-600 dark:hover:text-violet-400"
                >
                  {crumb.name}
                </Link>
              </span>
            ))}
            <span className="mx-2">›</span>
            <span className="text-zinc-900 dark:text-zinc-50">
              {categoryName}
            </span>
          </nav>

          <h1 className="text-4xl font-bold">
            <span className="text-gradient">{categoryName}</span>
          </h1>
          {categoryDescription && (
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {categoryDescription}
            </p>
          )}
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {total} {total === 1 ? "product" : "products"}
            {activeSubCategoryName && (
              <span>
                {" "}
                in <span className="font-medium text-violet-600 dark:text-violet-400">{activeSubCategoryName}</span>
              </span>
            )}
          </p>
        </div>
      </section>

      {/* Main content: sidebar + products */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filters sidebar */}
            <CategoryFilters
              slug={slug}
              subCategories={subCategoryOptions}
              currentSubCategoryId={subcategoryId}
              currentSort={currentSort}
              currentPriceRange={currentPriceRange}
              sortOptions={SORT_OPTIONS}
              totalProducts={total}
            />

            {/* Products area */}
            <div className="min-w-0 flex-1">
              {products.length > 0 ? (
                <>
                  <ProductGrid products={products} />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                      {currentPage > 1 && (
                        <Link
                          href={`/category/${slug}?page=${currentPage - 1}${currentSort ? `&sort=${encodeURIComponent(currentSort)}` : ""}${subcategoryId ? `&subcategory=${subcategoryId}` : ""}${currentPriceRange ? `&price=${currentPriceRange}` : ""}`}
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
                          href={`/category/${slug}?page=${currentPage + 1}${currentSort ? `&sort=${encodeURIComponent(currentSort)}` : ""}${subcategoryId ? `&subcategory=${subcategoryId}` : ""}${currentPriceRange ? `&price=${currentPriceRange}` : ""}`}
                          className="rounded-lg border border-violet-200 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-950/50"
                        >
                          Next →
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-5xl">📭</div>
                  <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    No products found
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {subcategoryId
                      ? "Try selecting a different sub-category or clear the filters."
                      : "This category doesn't have any products yet."}
                  </p>
                  {subcategoryId && (
                    <Link
                      href={`/category/${slug}`}
                      className="mt-4 text-sm font-medium text-violet-600 transition hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                      Clear filters
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
