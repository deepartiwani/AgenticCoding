
# my-commercetools-store


A modern, production-ready e-commerce storefront built with **Next.js 16 (App Router)**, **React 19**, **TypeScript 5**, and **Tailwind CSS v4**. Powered by commercetools Composable Commerce.

---

## Implementation Status (2026-02-24)

- All core e-commerce flows are implemented: authentication, product catalog, cart, checkout, and order history.
- User profile/account page is in progress.
- Wishlist and route protection (middleware) are pending.
- See `AGENT_CONTEXT.md` for a detailed checklist and recent changes.

---


## Features

- **Authentication:** Login, signup, and cookie-based session management
- **Product Catalog:** Category browsing, product detail pages, search with filters and sorting
**Cart & Checkout:** Add to cart, update quantities, full checkout flow, order confirmation
- **Order History:** View past orders by customer email
- **User Profile:** Account page (in progress)
- **Responsive Design:** Mobile-first, dark mode, custom vibrant theme
- **Server Components:** Data fetching and rendering on the server for performance and SEO
- **commercetools Integration:** All data via commercetools Platform SDK

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx            # Root layout (fonts, globals)
│   ├── page.tsx              # Root route (redirects to /login)
│   ├── globals.css           # Tailwind v4 + custom utilities
│   ├── cart/                 # Cart page & actions
│   ├── checkout/             # Checkout flow & confirmation
│   ├── orders/               # My Orders page
│   ├── categories/           # All-categories browse page
│   ├── category/[slug]/      # Category listing (PLP) with filters
│   ├── home/                 # Authenticated home/landing
│   ├── login/, signup/       # Auth pages (useActionState)
│   ├── product/[slug]/       # Product Detail Page (PDP)
│   └── components/           # Shared UI components
├── lib/
│   └── commercetools.ts      # SDK client + data helpers
```

---

## Getting Started

1. **Install dependencies:**
	```bash
	npm install
	```

2. **Set up environment variables:**
	Create a `.env.local` file in the project root with:
	```
	CTP_PROJECT_KEY=your-key
	CTP_CLIENT_ID=your-id
	CTP_CLIENT_SECRET=your-secret
	CTP_AUTH_URL=https://auth.commercetools.com
	CTP_API_URL=https://api.commercetools.com
	```

3. **Run the development server:**
	```bash
	npm run dev
	```
	Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Docker

To build and run the app in Docker:

```bash
docker build -t my-commercetools-store .
docker run --env-file .env.local -p 3000:3000 my-commercetools-store
```

---

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint

---

## Customization & Theming

- Uses Tailwind CSS v4 with custom utilities: `.btn-vibrant`, `.card-glow`, `.text-gradient`, etc.
- Fully responsive and supports dark mode.

---


## Known Issues & TODO

- User profile/account page is in progress
- Wishlist and route protection (middleware) are pending
- Duplicated `getLocalizedString()` helper is now consolidated in `src/lib/utils.ts`
- See `AGENT_CONTEXT.md` for full implementation status and open items

---


## Contributing

See `.github/copilot-instructions.md` and `AGENT_CONTEXT.md` for coding conventions, architecture, and project context.

---

## License

Proprietary — for internal use only.
