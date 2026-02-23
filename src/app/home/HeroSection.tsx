import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-violet-50 via-fuchsia-50 to-rose-50 dark:from-violet-950/30 dark:via-fuchsia-950/20 dark:to-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <span className="btn-vibrant inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md">
            ✨ New Season Collection
          </span>
          <h2 className="mt-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            <span className="text-gradient">Discover Products</span>{" "}
            <span className="text-zinc-900 dark:text-zinc-50">You&apos;ll Love</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Explore our curated collection of premium products. From electronics to fashion,
            find everything you need in one place.
          </p>
          <div className="mt-10 flex gap-4">
            <a
              href="#featured"
              className="btn-vibrant rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105"
            >
              Shop Now
            </a>
            <Link
              href="/categories"
              className="rounded-full border-2 border-violet-300 bg-white/80 px-8 py-3 text-sm font-semibold text-violet-700 backdrop-blur-sm transition hover:bg-violet-50 hover:border-violet-400 hover:scale-105 dark:border-violet-600 dark:bg-zinc-800/80 dark:text-violet-300 dark:hover:bg-violet-950/30"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-125 w-125 rounded-full bg-linear-to-br from-violet-300/50 to-fuchsia-300/50 blur-3xl dark:from-violet-800/30 dark:to-fuchsia-800/30" />
      <div className="pointer-events-none absolute -bottom-20 right-20 h-75 w-75 rounded-full bg-linear-to-tr from-pink-300/50 to-orange-300/40 blur-3xl dark:from-pink-800/25 dark:to-orange-800/20" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-60 w-60 rounded-full bg-linear-to-r from-cyan-300/30 to-blue-300/30 blur-3xl dark:from-cyan-800/20 dark:to-blue-800/20" />
    </section>
  );
}
