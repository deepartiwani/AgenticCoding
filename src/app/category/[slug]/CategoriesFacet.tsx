import React from "react";

interface SubCategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface CategoriesFacetProps {
  subCategories: SubCategoryOption[];
  currentSubCategoryId: string | null;
  onChange: (id: string | null) => void;
}

const CategoriesFacet: React.FC<CategoriesFacetProps> = ({
  subCategories,
  currentSubCategoryId,
  onChange,
}) => (
  subCategories.length > 0 ? (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        Sub-Category
      </h3>
      <div className="space-y-1">
        {/* "All" option */}
        <button
          onClick={() => onChange(null)}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
            currentSubCategoryId === null
              ? "bg-violet-100 font-semibold text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
              : "text-zinc-600 hover:bg-violet-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
        >
          <span
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
              currentSubCategoryId === null
                ? "border-violet-600 bg-violet-600 dark:border-violet-400 dark:bg-violet-400"
                : "border-zinc-300 dark:border-zinc-600"
            }`}
          >
            {currentSubCategoryId === null && (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </span>
          All Sub-Categories
        </button>
        {subCategories.map((subCat) => {
          const isSelected = currentSubCategoryId === subCat.id;
          return (
            <button
              key={subCat.id}
              onClick={() => onChange(subCat.id)}
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
              {subCat.name}
            </button>
          );
        })}
      </div>
    </div>
  ) : null
);

export default CategoriesFacet;
