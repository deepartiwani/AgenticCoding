export default function Footer() {
  return (
    <footer className="footer-gradient border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">All Products</a></li>
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">New Arrivals</a></li>
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">Best Sellers</a></li>
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">Sale</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">Help Center</a></li>
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">Shipping</a></li>
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">Returns</a></li>
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">About</a></li>
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">Careers</a></li>
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">Press</a></li>
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">Privacy Policy</a></li>
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">Terms of Service</a></li>
              <li><a href="#" className="transition hover:text-zinc-900 dark:hover:text-zinc-50">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-violet-200 pt-8 text-center text-sm text-zinc-500 dark:border-violet-800/30 dark:text-zinc-400">
          © 2026 MyStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
