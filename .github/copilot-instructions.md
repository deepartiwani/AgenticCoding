# Copilot Instructions — my-commercetools-store

> **IMPORTANT — Start every session by reading [`AGENT_CONTEXT.md`](../AGENT_CONTEXT.md).** It contains the live project state, recent changes, open work items, and session handoff notes. Update it whenever you make changes to the workspace.

## Architecture Overview

Next.js 16 App Router e-commerce storefront backed by **commercetools Composable Commerce**.
All data fetching happens server-side through the commercetools Platform SDK (`@commercetools/platform-sdk` + `@commercetools/sdk-client-v2`).
Styling is **Tailwind CSS v4** (imported via `@import "tailwindcss"` in `globals.css`).

**Key directories:**

- `src/lib/commercetools.ts` — singleton SDK client (`apiRoot`) and all data-fetching helpers (products, categories). Every new commercetools query belongs here.
- `src/app/home/` — authenticated home page components (Navbar, HeroSection, FeaturedProducts, ShopByCategory, Footer) plus `actions.ts` for server actions (logout).
- `src/app/login/` & `src/app/signup/` — auth pages using React 19 `useActionState` + server actions that call the commercetools Customer API.
- `src/app/product/[slug]/` & `src/app/category/[slug]/` — dynamic routes for PDP and category listing.

## Data Flow & commercetools Integration

- The SDK client in `src/lib/commercetools.ts` uses **client-credentials flow** (env vars: `CTP_PROJECT_KEY`, `CTP_CLIENT_ID`, `CTP_CLIENT_SECRET`, `CTP_AUTH_URL`, `CTP_API_URL`).
- Product data uses `productProjections()` endpoints; category data uses `categories()`. Filtering/sorting uses the search endpoint (`.search().get()`).
- All commercetools fields are localized objects (`Record<string, string>`). Always resolve with the helper pattern: `localized["en-US"] || localized["en"] || Object.values(localized)[0] || ""`.
- Prices live on `masterVariant.prices[0]` and are in cent amounts. Format using `Intl.NumberFormat` with `centAmount / 10^fractionDigits`.

## Patterns & Conventions

### Server vs Client Components
- **Pages are server components by default** — they fetch data directly and pass it as props to child components.
- Add `"use client"` only when the component needs interactivity (e.g., `Navbar.tsx`, `ProductGrid.tsx`, `LoginPage`).
- Interactive forms use **React 19 `useActionState`** paired with a `"use server"` action file (see `login/actions.ts`, `signup/actions.ts`).
- Submit buttons use `useFormStatus` for pending state (see `login/SubmitButton.tsx`).

### Authentication
- Auth is cookie-based: login sets `customer_email` as an httpOnly cookie; logout deletes it. Read via `cookies()` in server components.
- The root route (`/`) redirects to `/login`. After login, users go to `/home`.

### Styling
- Tailwind v4 with custom CSS utilities in `globals.css`: `.btn-vibrant`, `.card-glow`, `.text-gradient`, `.hero-gradient`, `.promo-gradient`, `.footer-gradient`.
- Design system uses a violet/purple/pink palette. Maintain this when adding new UI.
- All components support dark mode via Tailwind `dark:` variants.
- Mobile-first responsive approach using Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`).

### Localized String Helper
A `getLocalizedString()` utility is duplicated across several files. When adding new components, reuse this pattern or import from the nearest file. Consolidating it into a shared util is encouraged.

### Path Alias
Use `@/*` to import from `src/*` (configured in `tsconfig.json`).

## Dev Workflow

```bash
npm run dev    # Start dev server (localhost:3000)
npm run build  # Production build
npm run lint   # ESLint (next/core-web-vitals + typescript)
```

Ensure a `.env.local` file exists with: `CTP_PROJECT_KEY`, `CTP_CLIENT_ID`, `CTP_CLIENT_SECRET`, `CTP_AUTH_URL`, `CTP_API_URL`.

## Upcoming Work (from context.md)

Cart page, checkout flow, and order confirmation are not yet built. The state management approach (React Context or Zustand) is TBD. New features should follow the existing pattern: server-side data fetching in page components, client components only where interactivity is needed.

## Agent Context Protocol

- **`AGENT_CONTEXT.md`** (project root) is the shared memory between agent sessions.
- **On session start:** Read `AGENT_CONTEXT.md` first to understand current state and open threads.
- **On changes:** Update `AGENT_CONTEXT.md` before ending the session:
  - Add a row to the **Recent Changes** table with the date, agent name, and a brief summary.
  - Update **Current State of Implementation** (check/uncheck items, add new ones).
  - Update **Known Issues & Tech Debt** if anything was introduced or resolved.
  - Add any **Session Handoff Notes** for the next agent.
