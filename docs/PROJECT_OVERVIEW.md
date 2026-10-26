# SHOILPIKKABBO — Project Overview

## 1. Executive Summary

**SHOILPIKKABBO** is a premier Bangladeshi retail and business solutions commerce brand operating under the motto **"Delivery • Quality • Reliability"**. The platform serves both retail consumer shoppers and corporate/industrial clients across 10 specialized categories:

1. **Handicraft** — Handcrafted artisanal goods and traditional cultural items.
2. **Jute Items** — Eco-friendly jute bags, home decor, crafts, and lifestyle goods.
3. **Polymer** — Industrial and consumer polymer utility products.
4. **Baby Items** — Child care, infant essentials, apparel, and toys.
5. **Corporate Gift Items** — Branded executive merchandise, promotional sets, and custom corporate packages.
6. **Rudiment Garments** — Ready-to-wear clothing, basics, and textiles.
7. **Industrial Solutions** — Manufacturing aids, raw components, and industrial maintenance items.
8. **Health and Beauty** — Cosmetics, skincare, organic wellness foods, and health supplies.
9. **Agriculture** — Agro-inputs, organic farming supplies, tools, and specialty seed/gardening products.
10. **Special E-Sheba** — Dedicated service-inquiry hub for tailored corporate consulting, custom orders, technical support, and bespoke sourcing.

---

## 2. Verified Business Details

- **Business Name:** SHOILPIKKABBO
- **Official Email:** shoilpikkabbo@gmail.com
- **Customer Care & Inquiries:** `+880 1731214379`, `+880 1811909068`
- **Official Payment Verification Number:** `+880 1977765999`
- **Primary Banking Partner:** BRAC Bank PLC
- **Initial Store Language:** English (architected for seamless future Bangla localization)

---

## 3. High-Level System Architecture

```text
                        ┌────────────────────────────────────────┐
                        │      Client Browsers / Devices         │
                        └───────────────────┬────────────────────┘
                                            │
                                            ▼
                    ┌────────────────────────────────────────────────┐
                    │               Next.js App Router               │
                    │   - Server Components for SSR / SEO            │
                    │   - Interactive Client UI (Cart, Modals, Forms)│
                    │   - Sidebar Admin Dashboard Shell              │
                    │   - Unified Theme Tokens (Tailwind CSS)        │
                    └───────────────────────┬────────────────────────┘
                                            │ REST API (JSON)
                                            ▼
                    ┌────────────────────────────────────────────────┐
                    │             Express.js + TypeScript            │
                    │   - Zod Schema Validation                      │
                    │   - Centralized Middleware (Auth, Errors, Logs)│
                    │   - Decoupled Modular Services & Controllers   │
                    └───────────────────────┬────────────────────────┘
                                            │ Prisma ORM
                                            ▼
                    ┌────────────────────────────────────────────────┐
                    │               PostgreSQL Database              │
                    │   - Relational Tables, Foreign Keys, Indexes   │
                    │   - Decimal Types for Currency & Pricing       │
                    │   - Atomic Transactions for Orders & Inventory │
                    └────────────────────────────────────────────────┘
```

---

## 4. Key Architectural Principles

1. **Clean Separation of Concerns:**
   Frontend and backend are distinct codebases inside the monorepo (`frontend/` and `backend/`).
2. **Frontend-First Verification Gate:**
   The customer storefront and admin dashboard are designed, built, and thoroughly verified with high-fidelity demo mock data first (Phases 1–4). This guarantees client signoff on UX/UI and avoids costly backend churn.
3. **Relational Data Integrity:**
   All monetary calculations, coupon validations, inventory stock reservations, and order state transitions are authoritative on the backend with PostgreSQL atomic transactions.
4. **Resilient Payment Architecture:**
   Two-stage payment model:
   - Initial Stage: Manual verification (bKash / Nagad / BRAC Bank / COD) with reference code submission and admin audit flow.
   - Secondary Stage: Automated payment gateway integration (SSLCommerz / Shurjopay / bKash merchant) once production merchant credentials are confirmed.
