import React from "react";

interface PriceRangeFacetProps {
  currentPriceRange: string;
  onChange: (value: string) => void;
  priceRanges: { label: string; value: string }[];
}

const PriceRangeFacet: React.FC<PriceRangeFacetProps> = ({
  currentPriceRange,
  onChange,
  priceRanges,
}) => (
  <div>
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
      Price Range
    </h3>
    <div className="space-y-1">
      {priceRanges.map((range) => {
        const isSelected = currentPriceRange === range.value;
        return (
          <button
            key={range.value}
            onClick={() => onChange(range.value)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
              isSelected
                ? "bg-violet-100 font-semibold text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
                : "text-zinc-600 hover:bg-violet-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                isSelected
                  ? "border-violet-600 bg-violet-600 dark:border-violet-400 dark:bg-violet-400"
                  : "border-zinc-300 dark:border-zinc-600"
              }`}
            >
              {isSelected && (
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </span>
            {range.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default PriceRangeFacet;
