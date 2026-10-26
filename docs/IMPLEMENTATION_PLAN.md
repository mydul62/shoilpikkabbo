# SHOILPIKKABBO — Implementation Plan

This roadmap follows the phased approach specified in `intruction.md`. Each phase establishes verifiable milestones to ensure production-grade software quality.

---

## Roadmap Overview

```text
[ Phase 0: Planning & Architecture ] ◄── COMPLETE
         │
         ▼
[ Phase 1: Frontend Foundation & Design Tokens ]
         │
         ▼
[ Phase 2: Customer Website with Mock Data ]
         │
         ▼
[ Phase 3: Sidebar-Based Admin Dashboard ]
         │
         ▼
[ Phase 4: Frontend Review & Approval Gate ] ◄── FRONTEND SIGN-OFF
         │
         ▼
[ Phase 5: Backend & PostgreSQL + Prisma Setup ]
         │
         ▼
[ Phase 6: RESTful Backend Core Modules ]
         │
         ▼
[ Phase 7: Payment Processing (Manual & Gateway) ]
         │
         ▼
[ Phase 8: Full-Stack Integration ]
         │
         ▼
[ Phase 9: Testing, Security & Hardening ]
         │
         ▼
[ Phase 10: Production Deployment & Handover ]
```

---

## Detailed Phases

### Phase 0: Architecture, Documentation & Repository Setup
- [x] Initialize Git repository with comprehensive `.gitignore`
- [x] Create root project documentation in `docs/`:
  - `docs/PROJECT_OVERVIEW.md`
  - `docs/IMPLEMENTATION_PLAN.md`
  - `docs/DESIGN_SYSTEM.md`
  - `docs/DATABASE_DESIGN.md`
  - `docs/CLIENT_DECISIONS.md`
  - `docs/TESTING_CHECKLIST.md`
- [x] Define design token palette (Forest Green, Warm Ivory, Charcoal, Warm Gold).

### Phase 1: Frontend Foundation
- [ ] Initialize Next.js 15+ App Router in `frontend/` with TypeScript and Tailwind CSS.
- [ ] Configure Tailwind CSS color tokens, typography (`Inter` / `Outfit`), and custom utility classes.
- [ ] Install essential libraries (`lucide-react`, `clsx`, `tailwind-merge`).
- [ ] Build reusable UI primitives:
  - `Button`, `Input`, `Textarea`, `Select`, `Badge`, `Card`, `Modal / Dialog`, `DropdownMenu`, `Tabs`.
- [ ] Build global layout shells:
  - Storefront header (top banner, brand logo, search bar, navigation links, cart pill, user dropdown).
  - Storefront footer (business details, categories, customer service, payment badges, newsletter).
  - Admin layout shell with collapsible sidebar, top bar, breadcrumb navigation, and mobile drawer.

### Phase 2: Customer-Facing Storefront (with Structured Demo Data)
- [ ] High-fidelity mock dataset (`frontend/src/data/mock-data.ts`) covering all 10 categories, realistic products, coupons, and inquiries.
- [ ] **Homepage (`/`)**:
  - Hero banner with CTA and promotional slides.
  - Featured categories carousel / grid.
  - Flash deals & new arrivals.
  - Special E-Sheba service spotlight.
  - Company value propositions (Delivery • Quality • Reliability).
- [ ] **Category & Catalog Pages (`/shop`, `/categories/[slug]`)**:
  - Filter sidebar (Price range, category multi-select, in-stock only).
  - Sort by Price (Low/High), Newest, Popularity.
  - Responsive product cards with quick-add actions and stock badges.
- [ ] **Product Details (`/products/[slug]`)**:
  - Multi-image gallery with zoom/thumbnail switcher.
  - Quantity picker, SKU, stock status, delivery info.
  - Related items section and customer inquiry trigger.
- [ ] **Cart & Checkout (`/cart`, `/checkout`)**:
  - Cart drawer and dedicated cart page with real-time recalculations.
  - Coupon code validation UI.
  - Multi-step checkout: Shipping address, phone number, payment selection (bKash, Nagad, Bank, COD).
- [ ] **Order Tracking (`/track-order`)**:
  - Search by Order ID and Phone Number.
  - Visual timeline (Order Placed ➔ Processing ➔ Shipped ➔ Delivered).
- [ ] **Auth & Account (`/login`, `/register`, `/account`)**:
  - Customer login/register forms with client validation.
  - Account dashboard with order history, profile settings, and address book.
- [ ] **Content Pages**:
  - `/about` — Brand story, mission, and craftsmanship values.
  - `/contact` — Verified phone numbers, email, WhatsApp/Messenger actions, and contact form.
  - `/offers` — Active discount vouchers and seasonal bundles.
  - `/e-sheba` — Service inquiry submission form (B2B, corporate orders, custom sourcing).
  - `/careers` — Job listings and application modal.

### Phase 3: Sidebar-Based Admin Dashboard
- [ ] Dashboard shell with persistent desktop sidebar and responsive mobile drawer.
- [ ] **Overview (`/admin`)**: Metric KPI cards, recent orders table, pending manual payment alerts, inquiry notifications.
- [ ] **Products (`/admin/products`)**: Table with search, category filter, stock indicators, add/edit modal.
- [ ] **Categories (`/admin/categories`)**: Category ordering, slug manager, subcategory support.
- [ ] **Orders (`/admin/orders`)**: Order management table, status updates (Pending, Processing, Shipped, Delivered, Cancelled).
- [ ] **Payments (`/admin/payments`)**: Manual verification queue (match transaction ID to bKash/Nagad/Bank receipts).
- [ ] **Customers (`/admin/customers`)**: Customer list, lifetime order counts, contact details.
- [ ] **Coupons & Offers (`/admin/coupons`)**: Discount codes, minimum order value, validity dates.
- [ ] **Banners (`/admin/banners`)**: Homepage hero banners and promo manager.
- [ ] **Service Inquiries (`/admin/inquiries`)**: Special E-Sheba inquiries with customer details and follow-up status.
- [ ] **Careers (`/admin/careers`)**: Vacancy manager and received applicant resumes/inquiries.
- [ ] **Analytics (`/admin/analytics`)**: Revenue, order counts, top products, category distribution.
- [ ] **Settings (`/admin/settings`)**: Delivery charges (Inside/Outside Dhaka), contact numbers, bank account details.

### Phase 4: Frontend Review & Approval Gate
- [ ] Run full Next.js production build (`npm run build`).
- [ ] Execute strict TypeScript compilation check (`tsc --noEmit`).
- [ ] Verify responsive layout across Mobile (375px), Tablet (768px), and Desktop (1280px+).
- [ ] Validate zero broken navigation links and zero console errors.
- [ ] Document all frontend signoffs and unresolved backend dependencies in `docs/CLIENT_DECISIONS.md`.

### Phase 5 to 10 (Backend, Database, Payments, Integration & Deployment)
- Proceed systematically after Phase 4 review approval.
