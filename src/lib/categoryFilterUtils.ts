// Utility functions for category filter logic

export function buildUrl(
  slug: string,
  searchParams: URLSearchParams,
  overrides: Record<string, string | null>
): string {
  const params = new URLSearchParams(searchParams.toString());

  for (const [key, value] of Object.entries(overrides)) {
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  // Reset page when any filter changes
  if ("subcategory" in overrides || "price" in overrides) {
    params.delete("page");
  }

  const qs = params.toString();
  return `/category/${slug}${qs ? `?${qs}` : ""}`;
}

export function countActiveFilters(
  currentSubCategoryId: string | null,
  currentSort: string,
  currentPriceRange: string
): number {
  return [
    currentSubCategoryId !== null,
    currentSort !== "",
    currentPriceRange !== "",
  ].filter(Boolean).length;
}

export function hasActiveFilters(
  currentSubCategoryId: string | null,
  currentSort: string,
  currentPriceRange: string
): boolean {
  return (
    currentSubCategoryId !== null ||
    currentSort !== "" ||
    currentPriceRange !== ""
  );
}
