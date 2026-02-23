"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Spinner from "@/app/components/Spinner";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  price: string | null;
}

interface SearchBarProps {
  searchRef: React.RefObject<HTMLDivElement | null>;
}

export default function SearchBar({ searchRef }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setSuggestions(data.results ?? []);
      setShowDropdown(true);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      resetSearch();
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  function resetSearch() {
    setSearchQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  }

  return (
    <div ref={searchRef} className="relative ml-auto w-full max-w-xs sm:max-w-sm md:max-w-md">
      <form onSubmit={handleSearch}>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4 text-zinc-400 dark:text-zinc-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
          placeholder="Search products..."
          className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/30 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-violet-500 dark:focus:bg-zinc-800 dark:focus:ring-violet-500/20"
        />
      </form>
      {/* Suggestions dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Spinner size="sm" label="Searching…" fullPage={false} />
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  onClick={resetSearch}
                  className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-violet-50 dark:hover:bg-zinc-800"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-lg text-zinc-300 dark:text-zinc-600">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </p>
                    {item.price && (
                      <p className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                        {item.price}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
              {/* View all results link */}
              <div className="border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => {
                    const q = searchQuery.trim();
                    resetSearch();
                    router.push(`/search?q=${encodeURIComponent(q)}`);
                  }}
                  className="flex w-full items-center justify-center gap-1 px-4 py-2.5 text-sm font-medium text-violet-600 transition hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-zinc-800"
                >
                  View all results
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No products found for &ldquo;{searchQuery.trim()}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}