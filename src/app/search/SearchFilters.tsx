"use client";


import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { buildUrl } from "./searchFilterUtils";
import PriceRangeFacet from "./PriceRangeFacet";
import SortSelect, { SortOption } from "./SortSelect";

interface SearchFiltersProps {
  query: string;
  currentSort: string;
  currentPriceRange: string;
  sortOptions: SortOption[];
  totalProducts: number;
}

const SearchFilters = ({
  query,
  currentSort,
  currentPriceRange,
  sortOptions,
  totalProducts,
}: SearchFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);


  const handleSortChange = (sort: string) => {
    router.push(buildUrl(searchParams, query, { sort: sort || null }));
  };

  const handlePriceChange = (price: string) => {
    router.push(buildUrl(searchParams, query, { price: price || null }));
  };


  const handleClearFilters = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const hasActiveFilters = currentSort !== "" || currentPriceRange !== "";

  const activeFilterCount = [
    currentSort !== "",
    currentPriceRange !== "",
  ].filter(Boolean).length;

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
        {hasActiveFilters && (
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
      <SortSelect currentSort={currentSort} sortOptions={sortOptions} onChange={handleSortChange} />

      {/* Price range facet */}
      <PriceRangeFacet currentPriceRange={currentPriceRange} onChange={handlePriceChange} />
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-violet-300 dark:border-violet-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </span>
          <svg
            className={`h-4 w-4 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {mobileOpen && (
          <div className="mt-3 rounded-xl border border-violet-100 bg-white p-4 shadow-lg dark:border-violet-900/30 dark:bg-zinc-900">
            {filtersContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 rounded-xl border border-violet-100 bg-white p-5 shadow-sm dark:border-violet-900/30 dark:bg-zinc-900">
          {filtersContent}
        </div>
      </aside>
    </>
  );
};

export default SearchFilters;
