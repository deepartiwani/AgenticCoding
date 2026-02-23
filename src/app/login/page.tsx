"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginCustomer, type LoginState } from "./actions";
import SubmitButton from "./SubmitButton";

export default function LoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(
    loginCustomer,
    null
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-violet-50 via-fuchsia-50 to-rose-50 px-4 dark:from-zinc-950 dark:via-violet-950/20 dark:to-zinc-950">
      <div className="w-full max-w-md rounded-2xl border border-violet-200 bg-white/90 p-8 shadow-xl shadow-purple-500/10 backdrop-blur-sm dark:border-violet-800/30 dark:bg-zinc-950/90">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back
        </h1>
        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          Sign in to your account to continue.
        </p>

        {state?.error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-violet-400 dark:focus:ring-violet-400"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-violet-400 dark:focus:ring-violet-400"
              placeholder="••••••••"
            />
          </div>

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-violet-600 underline-offset-4 hover:underline dark:text-violet-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
