export { getLocalizedString } from "@/lib/utils";

export function formatPrice(
  centAmount: number,
  fractionDigits: number,
  currencyCode: string
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(centAmount / Math.pow(10, fractionDigits));
}

export function getStatusColor(status: string) {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300";
    case "Confirmed":
      return "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300";
    case "Complete":
      return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300";
    case "Cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300";
    default:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300";
  }
}

export function getPaymentStatusColor(status: string) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300";
    case "Pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300";
    case "Failed":
      return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300";
    default:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300";
  }
}
