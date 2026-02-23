"use client";

import { useRouter } from "next/navigation";

interface SortSelectProps {
  options: { label: string; value: string }[];
  currentSort: string;
  slug: string;
  currentPage: number;
}

export default function SortSelect({ options, currentSort, slug, currentPage }: SortSelectProps) {
  const router = useRouter();

  return (
    <select
      id="sort"
      value={currentSort}
      onChange={(e) => {
        const sort = e.target.value;
        const url = `/category/${slug}?page=${currentPage}${sort ? `&sort=${encodeURIComponent(sort)}` : ""}`;
        router.push(url);
      }}
      className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 dark:border-violet-800 dark:bg-zinc-900 dark:text-zinc-300"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
