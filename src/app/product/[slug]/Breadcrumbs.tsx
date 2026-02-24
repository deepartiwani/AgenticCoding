import Link from "next/link";
import { getLocalizedString } from "@/lib/utils";
import type { Category } from "@commercetools/platform-sdk";

interface BreadcrumbsProps {
  categories: Category[];
  productName: string;
}

export default function Breadcrumbs({ categories, productName }: BreadcrumbsProps) {
  return (
    <nav className="text-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-zinc-500 dark:text-zinc-400">
        <li>
          <Link href="/home" className="hover:text-violet-600 dark:hover:text-violet-400 font-medium">Home</Link>
        </li>
        {categories.map((cat, idx) => (
          <li key={cat.id} className="flex items-center">
            <span className="mx-2">/</span>
            <Link
              href={`/category/${cat.slug ? getLocalizedString(cat.slug) : cat.id}`}
              className="hover:text-violet-600 dark:hover:text-violet-400"
            >
              {getLocalizedString(cat.name)}
            </Link>
          </li>
        ))}
        <li className="flex items-center">
          <span className="mx-2">/</span>
          <span className="text-zinc-700 dark:text-zinc-200 font-semibold">{productName}</span>
        </li>
      </ol>
    </nav>
  );
}
