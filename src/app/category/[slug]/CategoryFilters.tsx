"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { buildUrl, countActiveFilters, hasActiveFilters } from "@/lib/categoryFilterUtils";
import MobileFilterToggle from "./MobileFilterToggle";
import PriceRangeFacet from "./PriceRangeFacet";
import CategoriesFacet from "./CategoriesFacet";

interface SubCategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface SortOption {
  label: string;
  value: string;
}


const PRICE_RANGES = [
  { label: "All Prices", value: "" },
  { label: "Under $25", value: "0-25" },
  { label: "$25 – $50", value: "25-50" },
  { label: "$50 – $100", value: "50-100" },
  { label: "$100 – $200", value: "100-200" },
  { label: "Over $200", value: "200-" },
];

interface CategoryFiltersProps {
  slug: string;
  subCategories: SubCategoryOption[];
  currentSubCategoryId: string | null;
  currentSort: string;
  currentPriceRange: string;
  sortOptions: SortOption[];
  totalProducts: number;
}

const CategoryFilters = ({
  slug,
  subCategories,
  currentSubCategoryId,
  currentSort,
  currentPriceRange,
  sortOptions,
  totalProducts,
}: CategoryFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const buildUrlCb = useCallback(
    (overrides: Record<string, string | null>) => buildUrl(slug, searchParams, overrides),
    [slug, searchParams]
  );

  const handleSubCategoryChange = (subCatId: string | null) => {
    router.push(buildUrlCb({ subcategory: subCatId }));
  };

  const handleSortChange = (sort: string) => {
    router.push(buildUrlCb({ sort: sort || null }));
  };

  const handlePriceChange = (price: string) => {
    router.push(buildUrlCb({ price: price || null }));
  };

  const handleClearFilters = () => {
    router.push(`/category/${slug}`);
  };

  const filtersAreActive = hasActiveFilters(currentSubCategoryId, currentSort, currentPriceRange);
  const activeFilterCount = countActiveFilters(currentSubCategoryId, currentSort, currentPriceRange);

  const filtersContent = (
    <div className="space-y-6">
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </h2>
        {filtersAreActive && (
          <button
            onClick={handleClearFilters}
            className="text-xs font-medium text-violet-600 transition hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Product count */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {totalProducts} {totalProducts === 1 ? "product" : "products"} found
      </p>

      {/* Sort filter */}
      <div>
        <label
          htmlFor="sort-select"
          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          Sort by
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-zinc-700 transition focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 dark:border-violet-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sub-category facet */}
      <CategoriesFacet
        subCategories={subCategories}
        currentSubCategoryId={currentSubCategoryId}
        onChange={handleSubCategoryChange}
      />

      {/* Price range facet */}
      <PriceRangeFacet
        currentPriceRange={currentPriceRange}
        onChange={handlePriceChange}
        priceRanges={PRICE_RANGES}
      />
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <MobileFilterToggle
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeFilterCount={activeFilterCount}
        filtersContent={filtersContent}
      />

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 rounded-xl border border-violet-100 bg-white p-5 shadow-sm dark:border-violet-900/30 dark:bg-zinc-900">
          {filtersContent}
        </div>
      </aside>
    </>
  );
};

export default CategoryFilters;
