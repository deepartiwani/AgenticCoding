# Project Context: Agentic Coding with commercetools

## 1. Project Overview
- **Name:** Starting Agentic Coding with commercetools
- **Purpose:** A learning-focused project to master Agentic Coding workflows while integrating with commercetools APIs. 
- **Core Vision:** Building a complete, modern e-commerce flow using autonomous AI coding agents to handle complex business logic and API orchestrations.

## 2. Tech Stack
- **Frontend:** Next.js (App Router preferred)
- **Styling:** Tailwind CSS
- **API/Headless Engine:** commercetools (Composable Commerce)
- **State Management:** (Pending - likely React Context or Zustand)
- **Backend/Database:** TBD (Currently utilizing commercetools APIs as the primary backend/data store).

## 3. Scope of Work (E-commerce Flow)
The goal is a full end-to-end journey including:
1.  **Identity:** Login Page, Sign-up Page.
2.  **Discovery:** Landing Page, Home Page, Product Listing Page (PLP).
3.  **Selection:** Product Detail Page (PDP), Cart Page.
4.  **Transaction:** Checkout Page, Order Confirmation Page.

## 4. Coding Standards & Agent Rules
- **API First:** Always reference commercetools SDK/APIs for data fetching.
- **Component Style:** Functional components with TypeScript. Use Tailwind for all styling (mobile-first approach).
- **Agentic Workflow:** When generating code, prioritize modularity so agents can easily "read" and "update" specific logic (e.g., separate API clients from UI components).
- **Security:** Ensure commercetools API keys and sensitive data are handled via environment variables (`.env`).


## 5. Current Progress & Focus (as of 2026-02-24)

- All core e-commerce flows are implemented: authentication, product catalog, cart, checkout, and order history.
- User profile/account page is in progress.
- Wishlist and route protection (middleware) are pending.
- The `getLocalizedString` helper is now consolidated in `src/lib/utils.ts`.