
// Category utilities for slug, name, breadcrumbs, and filter helpers
// getLocalizedString is now imported from @/lib/utils for consistency
export { getLocalizedString } from "@/lib/utils";

export function getLocalizedSlug(slug?: Record<string, string>): string {
  if (!slug) return "";
  return slug["en-US"] || slug["en"] || Object.values(slug)[0] || "";
}

import { getLocalizedString } from "@/lib/utils";
import type { Category } from "@commercetools/platform-sdk";

export function buildBreadcrumbs(
  category: Category,
  allCategories: Category[]
): { name: string; slug: string }[] {
  const breadcrumbs: { name: string; slug: string }[] = [];
  if (category.ancestors && category.ancestors.length > 0) {
    for (const ancestor of category.ancestors) {
      const found = allCategories.find((c) => c.id === ancestor.id);
      if (found) {
        breadcrumbs.push({
          name: getLocalizedString(found.name),
          slug: getLocalizedSlug(found.slug),
        });
      }
    }
  }
  return breadcrumbs;
}

export function buildSubCategoryOptions(
  subCategories: Category[]
): { id: string; name: string; slug: string }[] {
  return subCategories.map((subCat) => ({
    id: subCat.id,
    name: getLocalizedString(subCat.name),
    slug: getLocalizedSlug(subCat.slug),
  }));
}

export function parsePriceRange(priceRange: string): { priceMin?: number; priceMax?: number } {
  let priceMin: number | undefined;
  let priceMax: number | undefined;
  if (priceRange) {
    const [minStr, maxStr] = priceRange.split("-");
    if (minStr) priceMin = parseInt(minStr, 10);
    if (maxStr) priceMax = parseInt(maxStr, 10);
  }
  return { priceMin, priceMax };
}
