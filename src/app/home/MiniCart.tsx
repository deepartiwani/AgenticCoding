"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export default function MiniCart() {
  const { itemCount } = useCart();
  return (
    <div className="relative">
      <Link
        href="/cart"
        className="relative rounded-full p-2 text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 inline-flex"
        aria-label="Cart"
      >
        {/* Cart icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.865l1.606-7.023a1.125 1.125 0 0 0-1.096-1.362H6.218l-.803-3.006A1.125 1.125 0 0 0 4.331 0H3m4.5 17.25a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm10.5 0a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
          />
        </svg>
        {/* Badge */}
        {itemCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-linear-to-r from-violet-600 to-pink-500 text-[10px] font-bold text-white">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Link>
    </div>
  );
}