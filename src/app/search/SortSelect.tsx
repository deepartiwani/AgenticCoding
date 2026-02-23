import React from "react";

export interface SortOption {
  label: string;
  value: string;
}

interface SortSelectProps {
  currentSort: string;
  sortOptions: SortOption[];
  onChange: (value: string) => void;
}

const SortSelect: React.FC<SortSelectProps> = ({ currentSort, sortOptions, onChange }) => (
  <div>
    <label
      htmlFor="search-sort-select"
      className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
    >
      Sort by
    </label>
    <select
      id="search-sort-select"
      value={currentSort}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-zinc-700 transition focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 dark:border-violet-800 dark:bg-zinc-900 dark:text-zinc-300"
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default SortSelect;
