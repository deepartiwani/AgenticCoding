"use client";


import Link from "next/link";
import { logoutCustomer } from "./actions";

interface ProfileDropdownProps {
  customerEmail?: string;
  profileRef: React.RefObject<HTMLDivElement | null>;
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;
}

export default function ProfileDropdown({ customerEmail, profileRef, profileOpen, setProfileOpen }: ProfileDropdownProps) {
  const initials = customerEmail ? customerEmail.charAt(0).toUpperCase() : "U";

  return (
    <div ref={profileRef} className="relative">
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="btn-vibrant flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white transition hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
        aria-label="My Profile"
      >
        {initials}
      </button>

      {profileOpen && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          {/* Profile info */}
          <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              My Profile
            </p>
            {customerEmail && (
              <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                {customerEmail}
              </p>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Account Settings
            </Link>
            <Link
              href="/orders"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              My Orders
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-zinc-100 py-1 dark:border-zinc-800">
            <form action={logoutCustomer}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
                Logout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}