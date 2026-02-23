"use client";

import Link from "next/link";

const EmptyCart: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.865l1.606-7.023a1.125 1.125 0 0 0-1.096-1.362H6.218l-.803-3.006A1.125 1.125 0 0 0 4.331 0H3m4.5 17.25a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm10.5 0a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
      />
    </svg>
    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
      Your cart is empty
    </h2>
    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
      Looks like you haven&apos;t added anything to your cart yet.
    </p>
    <Link
      href="/home"
      className="btn-vibrant mt-6 inline-block rounded-lg px-6 py-3 text-sm font-medium text-white transition hover:scale-105"
    >
      Continue Shopping
    </Link>
  </div>
);

export default EmptyCart;
