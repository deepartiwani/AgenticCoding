# AGENT_CONTEXT — my-commercetools-store

> **Purpose:** This file is the single source of truth for AI coding agents working on this project. Every agent session MUST read this file first and update it before ending.

---

## How to Use This File

1. **Start of session:** Read this file in full to understand project state, recent changes, and open work items.
2. **During session:** Refer to the relevant sections when making decisions.
3. **End of session / after changes:** Update the sections below (especially _Recent Changes_, _Current State_, and _Known Issues_) to reflect what was done.

---

## Project Identity

| Field | Value |
|---|---|
| **Name** | my-commercetools-store |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Commerce Backend** | commercetools Composable Commerce |
| **Node Package Manager** | npm |
| **React Version** | 19 |

---

## Architecture Summary

```
src/
├── app/
│   ├── layout.tsx            # Root layout (Geist fonts, globals.css)
│   ├── page.tsx              # Root route → redirects to /login
│   ├── globals.css           # Tailwind v4 + custom utilities
│   ├── cart/                 # Cart page
│   │   ├── page.tsx          # Server component — fetches cart, transforms data
│   │   ├── actions.ts        # Server actions: add/update/remove/getCart
│   │   └── CartLineItems.tsx  # Client component — qty +/-, remove, order summary
│   ├── checkout/             # Checkout flow
│   │   ├── page.tsx          # Server component — fetches cart, redirects if empty
│   │   ├── actions.ts        # Server action: placeOrderAction
│   │   ├── CheckoutForm.tsx  # Client component — addresses, payment, place order
│   │   └── confirmation/
│   │       └── page.tsx      # Order confirmation page (server component)
│   ├── orders/               # My Orders page
│   │   └── page.tsx          # Server component — fetches orders by customer email
│   ├── categories/page.tsx   # All-categories browse page
│   ├── category/[slug]/      # Category listing (PLP) with sort & grid
│   │   ├── page.tsx
│   │   ├── ProductGrid.tsx   # Client component — interactive grid
│   │   ├── CategoryFilters.tsx # Client component — sidebar filters (sort, sub-category facet)
│   │   └── SortSelect.tsx    # (deprecated) standalone sort dropdown
│   ├── home/                 # Authenticated home / landing
│   │   ├── page.tsx          # Server component — fetches products & categories
│   │   ├── actions.ts        # Server action: logout
│   │   ├── Navbar.tsx        # Client component
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── ShopByCategory.tsx
│   │   ├── PromoBanner.tsx
│   │   └── Footer.tsx
│   ├── login/                # Login page
│   │   ├── page.tsx          # Client component (useActionState)
│   │   ├── actions.ts        # Server action: loginCustomer
│   │   └── SubmitButton.tsx  # useFormStatus pending button
│   ├── signup/               # Signup page
│   │   ├── page.tsx
│   │   ├── actions.ts        # Server action: signupCustomer
│   │   └── SubmitButton.tsx
│   └── product/[slug]/       # Product Detail Page (PDP)
│       ├── page.tsx
│       └── ProductImages.tsx
├── lib/
│   └── commercetools.ts      # SDK client + all data-fetching helpers
```

### Data-Fetching Helpers (src/lib/commercetools.ts)

| Function | Description |
|---|---|
| `getProducts(limit, categoryId?)` | Fetch product projections, optional category filter |
| `getCategories()` | Root-level categories (parent is not defined) |
| `getCategoryBySlug(slug)` | Single category lookup by localized slug |
| `getProductsByCategory(categoryId, limit, offset, sort?)` | Paginated + sorted products via search endpoint |
| `getProductBySlug(slug)` | Single product projection lookup by slug |
| `getAllCategories()` | All categories (up to 100), sorted by orderHint |
| `getProductsByCategories(ids, limit, offset, sort?, filterCategoryId?)` | Products from multiple category IDs with optional sub-category filter |

| `changeLineItemQuantity(cartId, version, lineItemId, qty)` | Update line item quantity in cart |
| `removeLineItem(cartId, version, lineItemId)` | Remove a line item from cart |
| `setCartAddresses(cartId, version, shipping, billing)` | Set shipping + billing addresses on cart |
| `createOrderFromCart(cartId, version)` | Create an order from an active cart |
| `getOrderById(orderId)` | Fetch a single order by ID |
| `getOrdersByCustomerEmail(email, limit?, offset?)` | Fetch orders for a customer email, sorted newest-first |

### Key Patterns

- **Server components by default.** Only add `"use client"` for interactivity.
- **React 19 `useActionState`** for form handling; `useFormStatus` for submit buttons.
- **Cookie-based auth:** `customer_email` httpOnly cookie set on login, deleted on logout.
- **Localized fields:** Always resolve via `localized["en-US"] || localized["en"] || Object.values(localized)[0] || ""`.
- **Prices:** cent amounts on `masterVariant.prices[0]`. Format with `Intl.NumberFormat`.
- **Path alias:** `@/*` → `src/*`.
- **Design system:** violet/purple/pink palette. Custom CSS classes: `.btn-vibrant`, `.card-glow`, `.text-gradient`, `.hero-gradient`, `.promo-gradient`, `.footer-gradient`.

---

## Environment Variables Required

```
CTP_PROJECT_KEY
CTP_CLIENT_ID
CTP_CLIENT_SECRET
CTP_AUTH_URL
CTP_API_URL
```

Stored in `.env.local` (git-ignored).

---


## Current State of Implementation

| Functionality                                   | Status      | Notes |
|-------------------------------------------------|-------------|-------|
| Project scaffolding (Next.js, Tailwind, SDK)    | ✅ Complete |       |
| commercetools SDK client (client-credentials)   | ✅ Complete |       |
| Login page (Customer API auth)                  | ✅ Complete |       |
| Signup page (Customer API registration)         | ✅ Complete |       |
| Cookie-based session management                 | ✅ Complete |       |
| Home page (Navbar, Hero, Featured, etc.)        | ✅ Complete |       |
| Product Detail Page (PDP)                       | ✅ Complete |       |
| Category Listing Page (PLP)                     | ✅ Complete |       |
| All Categories browse page                      | ✅ Complete |       |
| Root route redirect                             | ✅ Complete |       |
| Dark mode support                              | ✅ Complete |       |
| Mobile-first responsive design                  | ✅ Complete |       |
| Add to Cart (Cart API, Context, cookie)         | ✅ Complete |       |
| Live cart item count badge                      | ✅ Complete |       |
| Cart page (line items, qty, summary)            | ✅ Complete |       |
| Checkout flow (address, payment, order)         | ✅ Complete |       |
| Order confirmation page                         | ✅ Complete |       |
| My Orders page                                 | ✅ Complete |       |
| Shared components (ProductCard, Spinner, etc.)  | ✅ Complete |       |
| State management (CartContext)                  | ✅ Complete | Using React Context |
| commercetools integration (data helpers)        | ✅ Complete |       |
| Styling (Tailwind, custom utilities)            | ✅ Complete |       |
| Localization helper (getLocalizedString)        | ✅ Complete  | Now shared in src/lib/utils.ts |
| Localization helper (getLocalizedString)        | ✅ Complete  | Now consolidated in src/lib/utils.ts |
| Search functionality                           | ✅ Complete | Fully wired: API, filters, sort, UI |
| User profile / account page                     | ⏳ In Progress | Basic structure exists |
| Wishlist                                       | ⬜ Pending   |       |
| Middleware-based route protection               | ⬜ Pending   | No auth guard on /home etc. |


### Pending/Upcoming
<!-- Consolidation of localization helpers completed 2026-02-23 -->
- [ ] Complete user profile/account page
- [ ] Implement wishlist feature
- [ ] Add middleware-based route protection


---

## Known Issues & Tech Debt

1. **Duplicated `getLocalizedString()`** — Consolidated into `src/lib/utils.ts` as of 2026-02-23. Remove old copies as encountered.
2. **No auth middleware** — Authenticated routes (`/home`, `/categories`, etc.) are not protected. A user can access them without logging in.
3. **Root layout metadata** — `layout.tsx` still has the default "Create Next App" title/description. Should be updated to match the store branding.
4. **Client-credentials flow only** — The SDK uses machine-to-machine auth. Customer-specific carts/orders will eventually need a customer-scoped token or password flow.

---


## Recent Changes

| Date       | Agent / Author   | Summary                                                      |
|------------|------------------|--------------------------------------------------------------|
| 2026-02-23 | GitHub Copilot   | Updated implementation status checklist and pending items     |
| 2026-02-24 | GitHub Copilot   | Updated README, AGENT_CONTEXT, and context.md for latest implementation status, consolidated getLocalizedString, clarified pending items |
| 2026-02-23 | GitHub Copilot   | Updated implementation status checklist and pending items     |
| 2026-02-20 | Copilot          | Added themed Spinner component and loading files for all routes |
| 2026-02-20 | Copilot          | Redesigned categories & category pages, added filter sidebar |
| 2026-02-19 | Copilot          | Built My Orders page, updated Navbar profile dropdown        |
| 2026-02-19 | Copilot          | Built checkout flow and order confirmation page              |
| 2026-02-19 | Copilot          | Built cart page with CartLineItems and helpers               |
| 2026-02-19 | Copilot          | Implemented Add to Cart, cart helpers, React Context         |
| 2026-02-19 | Copilot          | Linked product cards to PDP with next/link                   |
| 2026-02-18 | Copilot          | Created AGENT_CONTEXT.md — initial baseline                  |

<!-- 
  AGENTS: Add new rows to this table when you make changes.
  Format: | YYYY-MM-DD | Agent Name | Brief summary of what changed |
-->

---

## Session Handoff Notes

<!--
  Use this section for any open threads, partially completed work, or decisions 
  the next agent session needs to be aware of. Clear items once resolved.
-->

- Checkout flow is fully implemented: `/checkout` → fill address + payment → Place Order → `/checkout/confirmation`.
- Cart "Proceed to Checkout" button now links to `/checkout`.
- On order placement, cart cookie is cleared and cart context item count is reset to 0.
- Payment is demo-only (no real processing); orders are created with `paymentState: 'Pending'`.
- Next logical features: search, user profile/account page, order history.
- Category pages redesigned: `/categories` is now a clean grid; `/category/[slug]` uses a sidebar filter pattern with sub-category facet. `SortSelect.tsx` is now unused (replaced by `CategoryFilters.tsx`).

---

## Related Documentation

- [context.md](context.md) — Original project vision and scope
- [.github/copilot-instructions.md](.github/copilot-instructions.md) — Coding conventions and patterns for Copilot
- [commercetools HTTP API docs](https://docs.commercetools.com/api)
- [commercetools TypeScript SDK](https://docs.commercetools.com/sdk/sdk-client-v2)
