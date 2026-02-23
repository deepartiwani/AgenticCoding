interface PersonalInfoProps {
  fullName: string | null;
  email: string;
  dateOfBirth?: string;
}

export function PersonalInfo({ fullName, email, dateOfBirth }: PersonalInfoProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 text-violet-600 dark:text-violet-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Personal Information
        </h3>
      </div>
      <dl className="mt-5 space-y-4 text-sm">
        <div>
          <dt className="font-medium text-zinc-500 dark:text-zinc-400">Full Name</dt>
          <dd className="mt-0.5 text-zinc-900 dark:text-zinc-100">{fullName || "—"}</dd>
        </div>
        <div>
          <dt className="font-medium text-zinc-500 dark:text-zinc-400">Email</dt>
          <dd className="mt-0.5 text-zinc-900 dark:text-zinc-100">{email}</dd>
        </div>
        {dateOfBirth && (
          <div>
            <dt className="font-medium text-zinc-500 dark:text-zinc-400">Date of Birth</dt>
            <dd className="mt-0.5 text-zinc-900 dark:text-zinc-100">
              {new Date(dateOfBirth).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
