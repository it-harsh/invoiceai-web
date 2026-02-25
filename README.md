# InvoiceAI — Frontend

Modern dashboard UI for AI-powered invoice & expense management.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Charts:** Recharts
- **Data Fetching:** TanStack React Query
- **Client State:** Zustand
- **Deployment:** Vercel

## Features

- **Dashboard** — Summary cards, spend-by-category chart, monthly trend chart, budget progress widget
- **Expenses** — Full CRUD, search/filter, approve/reject workflow, duplicate badges, CSV bulk import, email export
- **Invoices** — Upload to R2 via presigned URLs, AI extraction status tracking
- **Vendors** — Auto-populated vendor directory, edit default category
- **Recurring Expenses** — Create/manage recurring expense templates
- **Tax Reports** — Date-range tax summary by category and by vendor
- **Expense Policies** — Define spending rules, view violations
- **Budget Tracking** — Monthly limits per category, color-coded progress bars (green/amber/red)
- **Audit Logs** — Read-only log viewer with entity type + date range filters
- **Categories** — Custom category management with color picker
- **AI Assistant** — Floating chat panel powered by Gemini
- **Auth** — Login/register forms, httpOnly cookie-based JWT
- **Landing Page** — Marketing page with feature cards, pricing, testimonials

## Architecture

```
Browser → Next.js API Routes (BFF proxy) → Spring Boot Backend
```

- The browser **never** calls the Java backend directly
- Next.js API routes inject auth tokens from httpOnly cookies
- All data fetching uses React Query with query key-based cache invalidation
- 14 API proxy route files, 11 custom hooks, 30+ TypeScript interfaces

## Pages (12+)

| Route | Description |
|---|---|
| `/` | Landing page (marketing) |
| `/login`, `/register` | Authentication |
| `/dashboard` | Main dashboard with charts + budget progress |
| `/expenses` | Expense list with filters, bulk import, export |
| `/invoices` | Invoice list with upload |
| `/vendors` | Vendor directory |
| `/recurring-expenses` | Recurring expense templates |
| `/reports/tax-summary` | Tax summary report |
| `/settings/categories` | Category management |
| `/settings/policies` | Expense policies + violations |
| `/settings/budgets` | Budget limits + progress |
| `/settings/audit-logs` | Audit log viewer |

## Getting Started

```bash
# Install dependencies
pnpm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your BACKEND_URL

# Run dev server
pnpm dev    # http://localhost:3000

# Build for production
pnpm build
```

## Environment Variables

```bash
# .env.local
BACKEND_URL=http://localhost:8080    # Spring Boot backend
```

## Related

- **Backend:** [invoiceai-api](https://github.com/it-harsh/invoiceai-api) — Spring Boot 3.5 + Java 21
