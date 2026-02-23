interface SpinnerProps {
  /** Size of the spinner */
  size?: "sm" | "md" | "lg";
  /** Optional label displayed below the spinner */
  label?: string;
  /** Render as a full-page centered overlay */
  fullPage?: boolean;
}

const sizeClasses = {
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-[3px]",
  lg: "h-14 w-14 border-4",
} as const;

const Spinner = ({ size = "lg", label, fullPage = true }: SpinnerProps) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-violet-200 border-t-violet-600 dark:border-violet-800 dark:border-t-violet-400`}
        role="status"
        aria-label={label ?? "Loading"}
      />
      {label && (
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
      )}
    </div>
  );

  if (!fullPage) return spinner;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
      {spinner}
    </div>
  );
};

export default Spinner;
