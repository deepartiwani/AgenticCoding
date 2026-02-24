import { apiRoot } from "@/lib/commercetools";
import type { Category } from "@commercetools/platform-sdk";

/**
 * Given a category reference (with id), fetches the full ancestry chain (root to leaf).
 * Returns an array of categories ordered from root to the given category.
 */
export async function getCategoryBreadcrumbs(categoryId: string): Promise<Category[]> {
  const breadcrumbs: Category[] = [];
  let currentId = categoryId;
  while (currentId) {
    const response = await apiRoot
      .categories()
      .withId({ ID: currentId })
      .get()
      .execute();
    const category = response.body;
    breadcrumbs.unshift(category);
    currentId = category.parent?.id || "";
  }
  return breadcrumbs;
}
