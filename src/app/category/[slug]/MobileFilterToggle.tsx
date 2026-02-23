import React from "react";

interface MobileFilterToggleProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  activeFilterCount: number;
  filtersContent: React.ReactNode;
}

const MobileFilterToggle: React.FC<MobileFilterToggleProps> = ({
  mobileOpen,
  setMobileOpen,
  activeFilterCount,
  filtersContent,
}) => (
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
);

export default MobileFilterToggle;
