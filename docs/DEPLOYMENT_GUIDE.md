# SHOILPIKKABBO — Production Deployment & Handover Guide

> **Motto:** Delivery • Quality • Reliability  
> **Brand:** SHOILPIKKABBO

---

## 1. System Prerequisites

- **Node.js:** v20.x or v22.x LTS (compatible with v24.x)
- **Package Manager:** npm v10.x+
- **Database Engine:** PostgreSQL 15+ (Local, AWS RDS, Supabase, or Neon)

---

## 2. Environment Configuration

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:5432/shoilpikkabbo_db?schema=public"
JWT_SECRET="<YOUR_HIGH_ENTROPY_RANDOM_SECRET_KEY>"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
```

---

## 3. Database Migration & Seeding (Phase 5)

1. **Generate Prisma Client:**
   ```bash
   cd backend
   npm run prisma:generate
   ```

2. **Apply Database Migrations:**
   ```bash
   npm run prisma:migrate
   ```

3. **Run Initial Production/Development Seed:**
   ```bash
   npm run prisma:seed
   ```
   *Seeds all 10 core categories, default store settings, initial coupon vouchers (`WELCOME10`), and provisions the default administrator account.*

---

## 4. Default Admin Credentials

- **Role:** `ADMIN` (Full operational privileges)
- **Phone:** `01731214379`
- **Email:** `shoilpikkabbo@gmail.com`
- **Initial Password:** `admin1234` (Staff must change upon initial production login)
- **Admin Portal Access:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 5. Running the Application Locally

### Terminal 1: Backend REST API (Port 5000)
```bash
cd backend
npm run dev
# Or production mode:
# npm run build && npm start
```
Health Check: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

### Terminal 2: Customer Storefront & Admin Portal (Port 3000)
```bash
cd frontend
npm run dev
```
Storefront: [http://localhost:3000](http://localhost:3000)  
Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 6. Payment Processing Protocol

### Manual Verification Workflow (Phase 7):
1. Customer selects **bKash**, **Nagad**, or **BRAC Bank PLC** at checkout.
2. Customer sends the order amount to the verified recipient phone: **`01977765999`**.
3. Customer submits their **Transaction ID (TrxID)** or wire reference.
4. The transaction enters the **Manual Verification Queue** in the Admin Portal at [`/admin/payments`](http://localhost:3000/admin/payments).
5. Operations staff verifies the incoming amount in the bKash/Nagad merchant app or bank statement and clicks **"Approve"**.
6. The Order status automatically transitions to **PAID** and triggers packaging dispatch.

### Automated Payment Gateway (Online):
- To be enabled once the client provides production merchant keys (Store ID / Secret) for SSLCommerz or bKash Merchant API. Configuration is tracked in [`docs/CLIENT_DECISIONS.md`](./CLIENT_DECISIONS.md).

---

## 7. Handover Checklist & Completed Phases

- [x] **Phase 0:** Architecture, planning, design tokens, and Git repository setup.
- [x] **Phase 1:** Frontend foundation, design tokens, typography, and reusable UI primitives.
- [x] **Phase 2:** Complete customer storefront (Homepage, Catalog, Product Details, Cart, Checkout, Tracking, E-Sheba, About, Contact, Careers, Account, Auth).
- [x] **Phase 3:** Persistent sidebar-based Admin Dashboard with all 12 modules.
- [x] **Phase 4:** Production build verification and approval gate (0 errors across 28 routes).
- [x] **Phase 5:** Backend setup with PostgreSQL, Prisma schema (17 models/enums), and seed script.
- [x] **Phase 6:** Express RESTful API modular services and routes (Zod validation, centralized error handling).
- [x] **Phase 7:** Two-stage payment architecture with manual TrxID verification queue.
- [x] **Phase 8:** Full-stack API client integration (`frontend/src/lib/api.ts`).
- [x] **Phase 9:** Security audit (atomic transactions, password hashing, JWT authorization, input validation).
- [x] **Phase 10:** Production deployment, environment variable specs, and handover documentation.
