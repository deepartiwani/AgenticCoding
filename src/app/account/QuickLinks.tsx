import Link from "next/link";

interface QuickLinksProps {
  orderCount: number;
}

export function QuickLinks({ orderCount }: QuickLinksProps) {
  return (
    <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Quick Links
      </h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Link
          href="/orders"
          className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 text-violet-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          My Orders ({orderCount})
        </Link>
        <Link
          href="/cart"
          className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 text-violet-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.865l1.606-7.023a1.125 1.125 0 0 0-1.096-1.362H6.218l-.803-3.006A1.125 1.125 0 0 0 4.331 0H3m4.5 17.25a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm10.5 0a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
            />
          </svg>
          View Cart
        </Link>
        <Link
          href="/home"
          className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 text-violet-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
