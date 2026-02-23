interface AddressProps {
  address: {
    streetName?: string;
    streetNumber?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  } | null;
}

export function DefaultAddress({ address }: AddressProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 text-pink-600 dark:text-pink-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Default Address
        </h3>
      </div>
      {address ? (
        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">Street</dt>
            <dd className="mt-0.5 text-zinc-900 dark:text-zinc-100">
              {address.streetName}
              {address.streetNumber && ` ${address.streetNumber}`}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">City / Region</dt>
            <dd className="mt-0.5 text-zinc-900 dark:text-zinc-100">
              {[address.city, address.region, address.postalCode].filter(Boolean).join(", ")}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">Country</dt>
            <dd className="mt-0.5 text-zinc-900 dark:text-zinc-100">{address.country}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-5 text-sm text-zinc-400 dark:text-zinc-500">No address on file.</p>
      )}
    </div>
  );
}
