export default function PromoBanner() {
  return (
    <section id="deals" className="promo-gradient border-t border-zinc-200 bg-indigo-600 py-16 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h3 className="text-3xl font-bold text-white md:text-4xl">
          Get 20% Off Your First Order
        </h3>
        <p className="mt-4 text-lg text-indigo-100">
          Sign up for our newsletter and receive an exclusive discount code.
        </p>
        <form className="mx-auto mt-8 flex max-w-md gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-full bg-white/15 px-5 py-3 text-sm text-white placeholder-pink-200 outline-none ring-1 ring-white/25 backdrop-blur-sm transition focus:ring-2 focus:ring-white/60"
          />
          <button
            type="submit"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-violet-600 transition hover:bg-pink-50 hover:scale-105 hover:shadow-lg"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
