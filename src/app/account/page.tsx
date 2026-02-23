import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCustomerByEmail, getOrdersByCustomerEmail } from "@/lib/commercetools";
import { QuickLinks } from "./QuickLinks";
import { DefaultAddress } from "./DefaultAddress";
import { PersonalInfo } from "./PersonalInfo";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const customerEmail = cookieStore.get("customer_email")?.value;

  if (!customerEmail) {
    redirect("/login");
  }

  const [customer, orderData] = await Promise.all([
    getCustomerByEmail(customerEmail),
    getOrdersByCustomerEmail(customerEmail, 5),
  ]);

  const initials = customer
    ? `${(customer.firstName ?? "").charAt(0)}${(customer.lastName ?? "").charAt(0)}`.toUpperCase() || customerEmail.charAt(0).toUpperCase()
    : customerEmail.charAt(0).toUpperCase();

  const fullName = customer
    ? [customer.firstName, customer.lastName].filter(Boolean).join(" ")
    : null;

  const memberSince = customer?.createdAt
    ? new Date(customer.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  const defaultAddress = customer?.addresses?.[0] ?? null;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            My Account
          </h1>
          <Link
            href="/home"
            className="btn-vibrant inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Back to Store
          </Link>
        </div>

        {/* Profile Card */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="hero-gradient px-6 py-8">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white backdrop-blur-sm">
                {initials}
              </div>
              <div>
                {fullName && (
                  <h2 className="text-xl font-bold text-white">{fullName}</h2>
                )}
                <p className="text-sm text-white/80">{customerEmail}</p>
                {memberSince && (
                  <p className="mt-0.5 text-xs text-white/60">
                    Member since {memberSince}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <PersonalInfo
            fullName={fullName}
            email={customerEmail}
            dateOfBirth={customer?.dateOfBirth}
          />
          <DefaultAddress address={defaultAddress} />
        </div>

        <QuickLinks orderCount={orderData.total} />
      </div>
    </main>
  );
}
