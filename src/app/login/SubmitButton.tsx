"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-vibrant w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Signing in\u2026" : "Sign in"}
    </button>
  );
}
