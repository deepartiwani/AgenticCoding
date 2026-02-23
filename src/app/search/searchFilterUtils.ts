// Utilities and constants for SearchFilters

export interface PriceRange {
  label: string;
  value: string;
}

export const PRICE_RANGES: PriceRange[] = [
  { label: "All Prices", value: "" },
  { label: "Under $25", value: "0-25" },
  { label: "$25 – $50", value: "25-50" },
  { label: "$50 – $100", value: "50-100" },
  { label: "$100 – $200", value: "100-200" },
  { label: "Over $200", value: "200-" },
];

export function buildUrl(
  searchParams: URLSearchParams,
  query: string,
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
  // Always keep the query
  if (!params.has("q")) {
    params.set("q", query);
  }
  // Reset page when filters change
  if ("price" in overrides) {
    params.delete("page");
  }
  const qs = params.toString();
  return `/search${qs ? `?${qs}` : ""}`;
}
