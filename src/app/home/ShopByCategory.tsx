
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { Category } from "@commercetools/platform-sdk";
import Image from "next/image";
import Link from "next/link";
import { getLocalizedString } from "@/lib/utils";

function getCategoryName(category: Category): string {
  return getLocalizedString(category.name) || "Untitled";
}

function getCategoryDescription(category: Category): string | undefined {
  if (!category.description) return undefined;
  return getLocalizedString(category.description);
}

function getCategoryImage(category: Category): string | undefined {
  return category.assets?.[0]?.sources?.[0]?.uri;
}

function getCategorySlug(category: Category): string {
  if (!category.slug) return category.id;
  return category.slug["en-US"] || category.slug["en"] || Object.values(category.slug)[0] || category.id;
}

export default function ShopByCategory({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>(":scope > div")?.offsetWidth ?? 280;
    const gap = 24; // gap-6 = 1.5rem = 24px
    const distance = (cardWidth + gap) * 2;
    el.scrollBy({ left: direction === "left" ? -distance : distance, behavior: "smooth" });
  };

  return (
    <section id="categories" className="border-t border-violet-100 bg-linear-to-b from-violet-50/50 to-white py-20 dark:border-violet-900/30 dark:from-violet-950/10 dark:to-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-500 dark:text-violet-400">
          Shop by Category
        </h3>

        <div className="relative mt-10">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll categories left"
            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white/90 text-zinc-700 shadow-md backdrop-blur transition hover:bg-white hover:shadow-lg disabled:pointer-events-none disabled:opacity-0 dark:border-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll categories right"
            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white/90 text-zinc-700 shadow-md backdrop-blur transition hover:bg-white hover:shadow-lg disabled:pointer-events-none disabled:opacity-0 dark:border-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>

          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
          {categories.map((cat) => {
            const name = getCategoryName(cat);
            const description = getCategoryDescription(cat);
            const image = getCategoryImage(cat);
            const slug = getCategorySlug(cat);
            return (
              <Link
                href={`/category/${slug}`}
                key={cat.id}
                className="card-industrial w-56 shrink-0 snap-start group cursor-pointer rounded-2xl border border-[#b0b6bb] bg-[#f5f6f7] overflow-hidden text-center transition hover:border-[#7a8288] hover:shadow-lg dark:border-[#353b40] dark:bg-[#23272a] dark:hover:border-[#7a8288]"
              >
                <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-700">
                  {image ? (
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes="224px"
                      className="object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl text-zinc-300 dark:text-zinc-500">
                      🏷️
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {name}
                  </h4>
                  {description && (
                    <p className="mt-1 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">
                      {description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
