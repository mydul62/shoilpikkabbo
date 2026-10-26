# MASTER SUPER PROMPT: SHOILPIKKABBO
## Build a Production-Ready E-Commerce Platform from Scratch

### 1. Project Mission

Act as a senior software architect, product designer, UI/UX specialist, Next.js developer, backend engineer, PostgreSQL database architect, security engineer, QA engineer, and DevOps engineer.

Build a complete, professional, production-oriented e-commerce platform for my client, **SHOILPIKKABBO**.

This is a real client project, not a tutorial, demo-only website, or disposable prototype.

We are starting with a new codebase. Do not copy the old application's implementation. You may inspect the old project only as a visual reference for its sidebar-based dashboard layout, navigation patterns, and useful design ideas.

The new application must have its own clean, maintainable architecture and a polished visual identity.

**Core priorities:**
1. Premium, attractive, professional UI/UX.
2. Sidebar-based admin dashboard inspired by the old project.
3. Clean and scalable folder structure.
4. Frontend completed before substantial backend development.
5. PostgreSQL + Prisma ORM for database management.
6. Secure, reliable product, order, and payment workflows.
7. Fully responsive customer-facing website and dashboard.
8. Small, verifiable implementation steps.
9. Production-quality code, error handling, testing, and documentation.

Do not attempt to implement the entire application in one unreviewed code dump. Work through the phases below and verify each milestone.

---

# 2. Technology Stack

Use this stack unless a genuine compatibility issue requires a documented alternative.

### Frontend

- Next.js App Router.
- React.
- TypeScript with strict checking.
- Tailwind CSS.
- shadcn/ui.
- lucide-react for icons.
- React Hook Form and Zod for complex forms, where appropriate.
- Reusable, accessible UI components.
- Next.js Server Components by default.
- Client Components only where interaction requires them.
- Native `fetch` and server-side data fetching where appropriate.

### Backend

- Node.js.
- Express.js.
- TypeScript.
- RESTful API architecture.
- Zod validation.
- Centralized error handling.
- Authentication and authorization middleware.

### Database

- PostgreSQL.
- Prisma ORM.
- Prisma-managed relational schema and migrations.
- Development seed scripts.
- Transaction-safe order and inventory operations.

Use a Prisma version compatible with the project's runtime and follow the official documentation for that installed version.

Do not use MongoDB or Mongoose.

### Additional infrastructure

Choose suitable solutions for:

- Product image storage.
- Resume uploads.
- Email notifications, if required.
- Online payment gateway.
- Deployment and database hosting.

Do not invent credentials or assume access to paid services. Document the required configuration and use safe placeholders until the client supplies access.

---

# 3. Repository and Development Strategy

Create a fresh project with a clean structure.

Recommended repository organization:

```text
shoilpikkabbo/
├── frontend/
├── backend/
├── docs/
├── .gitignore
└── README.md
```

You may adjust this structure when the chosen tooling requires it, but keep frontend and backend responsibilities clearly separated.

Before writing application features:

1. Inspect the available development environment.
2. Check installed Node.js and package-manager versions.
3. Establish the frontend and backend architecture.
4. Create the initial folder structure.
5. Document the implementation phases.
6. Establish Git tracking without exposing secrets.
7. Confirm that the initial applications run.
8. Begin frontend implementation.

Do not copy old project files blindly. Reuse the old project only to understand the desired dashboard interaction and sidebar-based layout.

---

# 4. Brand Identity and Visual Design

Brand: SHOILPIKKABBO

Tagline: Delivery • Quality • Reliability

The website must look like a credible, established online business.

Do not create a generic template with oversized text, excessive gradients, random colors, unnecessary cards, or inconsistent spacing.

## Design direction

Create a distinctive, modern commerce experience using:

- A refined, warm, premium visual identity.
- Consistent typography and spacing.
- A restrained color palette.
- Clear visual hierarchy.
- High-quality product imagery.
- Thoughtful white space.
- Clean borders and subtle shadows.
- Consistent iconography.
- Subtle transitions and purposeful animations.
- Excellent responsive behavior.
- Accessible contrast and keyboard interaction.

Suggested starting palette:

- Deep forest green: primary brand color.
- Warm ivory: main background.
- Charcoal: primary text.
- Muted gray: secondary text.
- Restrained gold or a warm accent: selected highlights.

Treat these colors as a starting proposal. Define design tokens centrally and use them consistently.

Do not change the palette randomly between pages. Avoid unnecessary animation, excessive rounded cards, glassmorphism everywhere, and distracting effects.

## Typography and spacing

- Use a consistent font system.
- Establish a clear heading hierarchy.
- Keep body text comfortable to read.
- Standardize content widths, section spacing, form heights, button sizes, and card spacing.
- Use consistent responsive breakpoints.

## Product imagery

- Use relevant, high-quality product images.
- Prefer verified client assets when supplied.
- Use appropriate development placeholders when actual product images are unavailable.
- Never present placeholder products or generated information as verified real inventory.

## Logo

Use the official client logo if provided. Otherwise, create a simple text-based temporary brand treatment. Do not invent an official logo file.

---

# 5. Mandatory Sidebar-Based Admin Dashboard

The admin dashboard is a core product requirement.

Build a beautiful, professional, responsive dashboard with a persistent sidebar on desktop and a mobile drawer or suitable compact navigation on smaller screens.

The old project is only a visual reference. Do not reproduce its code or inherit its technical limitations.

## Sidebar requirements

Include navigation for:

- Overview.
- Products.
- Categories.
- Orders.
- Payments.
- Customers.
- Coupons and Offers.
- Banners.
- Service Inquiries.
- Careers.
- Analytics.
- Website Settings.

Use clear icons, active-route indicators, grouped navigation where useful, and sensible spacing.

Requirements:

- Collapsible sidebar on desktop where appropriate.
- Mobile-friendly sidebar drawer.
- Persistent and predictable navigation behavior.
- Clear active page state.
- Consistent header and page title area.
- Breadcrumbs where useful.
- Profile menu and logout action.
- Responsive tables and forms.
- Confirmation dialogs for destructive actions.
- Loading, empty, error, and success states.

Do not create separate dashboard designs for each module. Reuse the same dashboard shell and visual language.

## Overview page

Include well-designed summary cards for:

- Total orders.
- Pending orders.
- Confirmed revenue.
- Total products.
- Low-stock products.
- Total customers.
- Pending manual payment verification.

Also include appropriate visualizations and recent activity, such as:

- Sales trends when sufficient data exists.
- Order status distribution.
- Recent orders.
- Recent service inquiries.

During frontend development, use clearly labeled demo data. Once integrated, calculate statistics from real backend data.

Never present demo numbers as actual business results.

## Dashboard quality standard

The dashboard must look polished enough for a real business to use daily.

Prioritize readability, data density, practical workflows, clear statuses, useful filters, responsive layouts, and efficient administrative actions over decorative elements.

---

# 6. Customer-Facing Website

Build a cohesive online shopping experience that shares the same brand identity as the dashboard.

## 6.1 Homepage

Include:

- Responsive navigation.
- Brand identity.
- Product search.
- Category navigation.
- Cart access.
- Account access.
- Attractive hero section.
- Featured categories.
- Featured products.
- New arrivals or popular products where appropriate.
- Promotional banners.
- Special E-Sheba introduction.
- Company introduction.
- Customer support and contact information.
- Professional footer.

Do not add irrelevant sections simply to make the homepage longer.

## 6.2 Product listing pages

Implement:

- Product grid.
- Product search by name.
- Category and optional subcategory filtering.
- Price range filtering.
- Sorting by price, newest, and relevant criteria.
- Pagination or a suitable loading strategy.
- Product availability indicators.
- Clear loading, empty, and error states.

Ensure filters and sorting actually work.

## 6.3 Product detail pages

Include:

- Product image gallery.
- Product name.
- Description.
- Price and optional sale price.
- Stock status.
- Quantity selector.
- Add-to-cart action.
- Related products when appropriate.
- Clear validation and feedback.

Do not invent actual product specifications or stock levels.

## 6.4 Cart

Include:

- Product image and details.
- Quantity adjustments.
- Remove-item action.
- Subtotals.
- Coupon application.
- Delivery charge display.
- Final order estimate.
- Empty-cart state.
- Continue-shopping and checkout navigation.

All authoritative prices and totals must be recalculated on the backend.

## 6.5 Checkout

Collect the necessary information:

- Customer name.
- Contact number.
- Email where appropriate.
- Delivery address.
- Order summary.
- Payment method.
- Delivery instructions where needed.

Support guest checkout unless the client decides otherwise. Logged-in customers should be able to use their saved information where implemented.

Show clear validation and payment instructions.

## 6.6 Customer account

Implement:

- Registration.
- Login and logout.
- Profile management.
- Order history.
- Order details.
- Appropriate saved-address functionality.
- Secure account access.

## 6.7 Order tracking

Create a clear order-tracking experience using an order reference and suitable verification.

Display the relevant order, payment, and delivery statuses.

Delivery status will initially be maintained manually by authorized staff. Do not claim live GPS tracking or automated courier integration.

## 6.8 About Us

Include:

- Company profile.
- Mission.
- Vision.
- Business introduction.

Use client-approved information or clearly marked placeholders.

## 6.9 Contact Us

Include:

- Contact numbers.
- Email.
- Business information.
- WhatsApp contact action.
- Messenger contact action where official details are available.
- Contact inquiry form if appropriate.

Do not invent social media or messaging destination URLs.

## 6.10 Offers and coupons

Display active offers and allow eligible coupons to be applied during checkout.

The backend must validate coupon eligibility, expiration, limits, and discount amounts.

## 6.11 Special E-Sheba

Create a service-information and inquiry section.

Customers should be able to:

- View service information.
- Select or describe a service type.
- Submit contact information.
- Describe their requirements.
- Receive submission confirmation.

This is an inquiry workflow, not a booking system. Do not add service booking or automatic service payments without client approval.

## 6.12 Careers

Include a career page, job listings when available, job details, and application submission.

Support resume uploads only after a suitable, secure file-storage strategy is configured.

If no vacancies exist, show a meaningful empty state rather than fake jobs.

---

# 7. Product Categories

Configure these initial categories:

1. Handicraft.
2. Jute Items.
3. Polymer.
4. Baby Items.
5. Corporate Gift Items.
6. Rudiment Garments.
7. Industrial Solutions.
8. Health and Beauty.
9. Agriculture.
10. Special E-Sheba.

Health and Beauty may include cosmetics, food, and medicine where legally permitted and appropriately managed.

Special E-Sheba must be treated as a service inquiry section, not a normal purchasable product category.

Category management must support creation, editing, activation, deactivation, display ordering, slugs, and optional subcategories.

Products must support category relationships, pricing, descriptions, stock, SKU where needed, and image metadata.

This is a single-business store, not a multi-vendor marketplace.

---

# 8. Client Information

Use the following client-supplied details where appropriate:

- Business: SHOILPIKKABBO.
- Email: shoilpikkabbo@gmail.com.
- Contact number: 01731214379.
- Additional contact number: 01811909068.
- Payment contact number: 01977765999.
- Bank name: BRAC Bank.

Verify payment instructions with the client before enabling them in production.

Do not invent bank account details, merchant credentials, business policies, real products, prices, job openings, or social URLs.

Initial language: English.

Prepare the application for future Bangla localization without implementing a full translation unless approved.

---

# 9. Phase-by-Phase Implementation Workflow

Follow the phases in order. Break each phase into small tasks and verify each milestone before continuing.

## PHASE 0 — Architecture and Planning

1. Establish the new repository.
2. Decide the frontend and backend folder organization.
3. Define the application architecture.
4. Define the design tokens.
5. Define the initial routes.
6. Design the sidebar navigation structure.
7. Document the database entities and relationships.
8. Identify external dependencies.
9. Document pending client decisions.

Create:

- `docs/PROJECT_OVERVIEW.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/DATABASE_DESIGN.md`
- `docs/CLIENT_DECISIONS.md`
- `docs/TESTING_CHECKLIST.md`

Do not start by generating every feature at once.

## PHASE 1 — Frontend Foundation

Build:

- Next.js application structure.
- Global styles and design tokens.
- Shared typography and layout.
- Reusable buttons, inputs, cards, dialogs, and status badges.
- Header and footer.
- Responsive navigation.
- Sidebar-based admin dashboard shell.
- Admin header, sidebar, breadcrumbs, and page layout.
- Shared table, form, and empty-state components.

Verify the foundation before implementing the full pages.

## PHASE 2 — Customer Website with Demo Data

Implement:

1. Homepage.
2. Category pages.
3. Product listing.
4. Product details.
5. Search, filtering, and sorting.
6. Shopping cart.
7. Checkout interface.
8. Order tracking interface.
9. Login and registration pages.
10. Customer account pages.
11. About Us.
12. Contact Us.
13. Offers.
14. Special E-Sheba.
15. Careers.

Organize demo data in a dedicated data layer. Use realistic but explicitly fictional development records.

Ensure all visible controls work within the frontend prototype. Do not leave decorative buttons that do nothing.

## PHASE 3 — Admin Dashboard with Demo Data

Implement the sidebar navigation and these pages:

1. Overview.
2. Product management.
3. Category management.
4. Order management.
5. Payment management.
6. Customer management.
7. Coupon management.
8. Banner management.
9. Service inquiry management.
10. Career management.
11. Analytics.
12. Website settings.

Build reusable forms, tables, search controls, filters, dialogs, and status components.

Use consistent visual patterns and maintain the same sidebar across administrative pages.

## PHASE 4 — Frontend Review and Approval Gate

Before substantial backend development:

- Run the production build.
- Run TypeScript and lint checks.
- Test every route.
- Test all forms and interactions.
- Test cart calculations in the prototype.
- Test sidebar navigation.
- Inspect desktop, tablet, and mobile layouts.
- Verify loading, empty, error, and success states.
- Fix broken links and inconsistent styling.
- Review accessibility and keyboard navigation.
- Check the browser console.

Do not begin substantial backend implementation while the frontend foundation remains broken or visibly incomplete.

Document any frontend issue blocked by the absence of real APIs.

## PHASE 5 — Backend and PostgreSQL + Prisma

Initialize the backend with Node.js, Express, and TypeScript.

Configure PostgreSQL and Prisma using a version-compatible setup.

Design and implement relational models for the required entities, such as:

- User.
- Category.
- Product.
- Product image.
- Cart and cart item where needed.
- Order.
- Order item.
- Payment.
- Delivery tracking event.
- Coupon and coupon usage where needed.
- Service inquiry.
- Career listing.
- Career application.
- Banner.
- Site settings.
- Audit log where appropriate.

Use suitable relations, indexes, unique constraints, enums, and timestamps.

Use `Decimal` for money. Use transactions or atomic operations where needed for inventory and orders.

Keep `prisma/schema.prisma` as the source of truth for Prisma-managed models. Do not use Mongoose-style model files.

Create development migrations and seed scripts. Never reset a production database as a shortcut.

## PHASE 6 — Backend Modules

Implement and test modules incrementally:

1. Database configuration.
2. Authentication and authorization.
3. Users and profiles.
4. Categories.
5. Products and inventory.
6. Cart.
7. Checkout and orders.
8. Payments.
9. Delivery tracking.
10. Coupons.
11. Service inquiries.
12. Careers and applications.
13. Banners.
14. Website settings.
15. Analytics.

Follow a modular folder structure with separate validation, service, controller, and route files where appropriate.

Do not duplicate business logic across controllers.

Use consistent API responses, centralized error handling, request validation, pagination, and server-side authorization.

## PHASE 7 — Payment Integration

Implement manual payment submission and verification first.

Potential methods:

- bKash.
- Nagad.
- Bank transfer.
- Card payments through an approved gateway.
- Cash on Delivery, if approved.

Before implementing live online payments, confirm the gateway provider and merchant access.

Verify gateway transactions on the server. Handle duplicate callbacks safely. Never mark an order as paid solely because the frontend reports success.

Do not store raw card data or invent payment credentials.

## PHASE 8 — Frontend and Backend Integration

Connect the frontend to real APIs in small milestones:

1. Categories.
2. Products.
3. Search and filtering.
4. Cart.
5. Checkout.
6. Orders.
7. Payments.
8. Customer accounts.
9. Admin product management.
10. Admin order management.
11. Remaining dashboard modules.

Use server-side fetching where appropriate. Use native `fetch` unless a justified requirement calls for another client.

Remove demo data from production flows only after the corresponding API works and has been tested.

## PHASE 9 — Security and Testing

Test:

- Authentication and permissions.
- Product and category operations.
- Cart and checkout.
- Inventory consistency.
- Order totals and historical price snapshots.
- Coupon rules.
- Manual payment verification.
- Gateway callbacks where configured.
- Delivery status updates.
- Customer data isolation.
- File-upload validation.
- Service inquiries.
- Career applications.
- Dashboard access control.
- Error handling and database constraints.

Use unit, integration, and end-to-end tests where appropriate.

Run the production build and relevant checks. Report actual results without claiming unrun tests passed.

## PHASE 10 — Deployment and Handover

Document:

- Local development setup.
- Required environment variables.
- PostgreSQL configuration.
- Prisma generation and migration commands.
- Safe seed process.
- Frontend and backend deployment.
- Image and file storage.
- Payment gateway configuration.
- Admin account provisioning.
- Database backup and recovery.
- Known limitations.
- Pending client decisions.

Do not deploy with test credentials, fake payment verification, or insecure default passwords.

---

# 10. Suggested Backend Folder Structure

Use this structure when establishing the new backend:

```text
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   └── prisma.ts
│   ├── middlewares/
│   ├── utils/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── product/
│   │   ├── category/
│   │   ├── cart/
│   │   ├── order/
│   │   ├── payment/
│   │   ├── delivery/
│   │   ├── coupon/
│   │   ├── inquiry/
│   │   ├── service/
│   │   ├── career/
│   │   ├── banner/
│   │   ├── analytics/
│   │   └── settings/
│   ├── app.ts
│   └── server.ts
├── .env.example
├── package.json
└── tsconfig.json
```

Each module should follow a consistent pattern when appropriate:

```text
product/
├── product.interface.ts
├── product.validation.ts
├── product.service.ts
├── product.controller.ts
└── product.route.ts
```

Keep the architecture modular without creating unnecessary files or abstraction layers.

---

# 11. Data Fetching and Code Quality Rules

- Use Next.js Server Components by default.
- Use Client Components for interactive UI.
- Use server-side `fetch` for server-rendered data where appropriate.
- Do not use Axios by default.
- Do not use `"use server"` as a replacement for a proper API architecture.
- Keep environment secrets on the server.
- Validate all untrusted input.
- Keep business logic in service layers.
- Use database transactions for related operations.
- Avoid duplicated components and duplicated business logic.
- Avoid giant components that combine unrelated responsibilities.
- Keep types strict and avoid unnecessary `any`.
- Use consistent naming conventions.
- Keep loading, empty, error, and success states consistent.
- Add comments only where they clarify non-obvious behavior.
- Never hide errors just to make a build appear successful.

---

# 12. Git Workflow

Use Git to protect the project and make changes traceable.

1. Initialize Git if needed.
2. Add a suitable `.gitignore`.
3. Never commit secrets.
4. Work in small logical milestones.
5. Run relevant checks before commits.
6. Summarize modified files after each milestone.
7. Do not push to a remote repository without authorization.
8. Do not run destructive cleanup commands without explicit permission.

---

# 13. Client Decisions to Track

Maintain `docs/CLIENT_DECISIONS.md`.

Record unresolved decisions, including:

- Approved payment gateway.
- Verified payment instructions.
- Cash on Delivery availability.
- Delivery fees and delivery zones.
- Cancellation and refund policies.
- Guest checkout requirements.
- Official logo and brand assets.
- Real product catalog and prices.
- Official social media and messaging links.
- Current job vacancies.
- Bangla localization timing.
- Hosting and payment credentials.

Use safe placeholders where necessary. Do not let unresolved payment credentials block unrelated frontend work.

---

# 14. Definition of Done

The project is ready for handover when:

- The new application uses a clean, documented architecture.
- The customer-facing website is attractive, responsive, and functional.
- The admin dashboard uses a consistent sidebar-based design.
- Products and categories can be managed.
- Search, filtering, and sorting work.
- Cart and checkout use server-validated totals.
- Orders and manual delivery tracking work.
- Manual payments have an auditable verification workflow.
- Online payments work only when the approved provider and credentials are available and integration has been verified.
- Customer authentication and authorization are secure.
- Special E-Sheba inquiries work.
- Career functionality follows the supplied business information.
- PostgreSQL and Prisma migrations are configured correctly.
- Database operations protect inventory and order consistency.
- Relevant tests and production builds have been run.
- Deployment and handover documentation is complete.
- Unfinished items and client dependencies are clearly documented.

Do not mark incomplete or untested features as finished.

---

# 15. First Execution Instruction

Begin with Phase 0.

Create the new project structure and documentation. Establish the design system and sidebar dashboard architecture. Then implement the frontend in small, verifiable steps.

**Do not start with the backend. Do not generate the entire application in one step. Do not build a generic dashboard. Do not sacrifice visual quality for speed.**

After every milestone, report:

- Completed work.
- Files created or changed.
- Verification results.
- Outstanding issues.
- The next planned milestone.

Build SHOILPIKKABBO as a professional, maintainable, real-world commerce platform with a distinctive storefront, a beautiful sidebar-based admin dashboard, PostgreSQL + Prisma, and secure business workflows.