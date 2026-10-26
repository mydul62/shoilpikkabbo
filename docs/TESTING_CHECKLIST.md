# SHOILPIKKABBO — Quality Assurance & Testing Checklist

This checklist governs the quality control for Phase 4 (Frontend Gate) and Phase 9 (End-to-End System Gate).

---

## 1. Storefront Interface Verification

- [ ] **Global Header:**
  - [ ] Top info bar displays verified contact phone (`01731214379`) and email.
  - [ ] Brand logo links to home page `/`.
  - [ ] Search bar opens results dropdown or navigates to `/shop?q=...`.
  - [ ] Category navigation dropdown lists all 10 categories correctly.
  - [ ] Cart icon badge accurately reflects total item count in real-time.
  - [ ] Account icon opens login/register modal or account link.
- [ ] **Homepage Sections:**
  - [ ] Hero carousel / banner auto-advances or navigates on arrow click.
  - [ ] Category cards navigate to respective category query.
  - [ ] Featured product cards display price, sale discount, and "Add to Cart" action.
  - [ ] Special E-Sheba banner links to `/e-sheba`.
  - [ ] Value proposition badges (Delivery • Quality • Reliability) render crisply.
- [ ] **Product Catalog (`/shop`, `/categories/[slug]`):**
  - [ ] Category filter toggles product list accurately.
  - [ ] Price slider or min/max price filter recalculates displayed items.
  - [ ] Sorting dropdown (Price: Low to High, High to Low, Newest) operates correctly.
  - [ ] Empty state renders gracefully when no products match filters.
- [ ] **Product Details (`/products/[slug]`):**
  - [ ] Image gallery switches primary view when thumbnail is clicked.
  - [ ] Quantity counter increments and decrements (min: 1, max: available stock).
  - [ ] "Add to Cart" triggers feedback toast and increments cart badge.
  - [ ] Related products section displays relevant category items.
- [ ] **Cart & Checkout (`/cart`, `/checkout`):**
  - [ ] Quantity adjustments update item subtotal and grand total dynamically.
  - [ ] Item removal removes line item and adjusts totals.
  - [ ] Coupon validation applies discount (e.g. `WELCOME10` applies 10% discount).
  - [ ] Delivery charge updates based on selected location (Inside Dhaka vs. Outside Dhaka).
  - [ ] Manual payment method (bKash/Nagad) displays verified recipient number `01977765999` and transaction ID input field.
  - [ ] Bank transfer displays BRAC Bank details and transaction reference field.
- [ ] **Order Tracking (`/track-order`):**
  - [ ] Inputting order ID + phone number displays order progress timeline.
- [ ] **Special E-Sheba (`/e-sheba`):**
  - [ ] Service inquiry form captures service type, requirements, and contact details.
  - [ ] Submitting form displays clear confirmation message.
- [ ] **Careers (`/careers`):**
  - [ ] Career listings render department, location, and requirements.
  - [ ] Application modal opens for applicant contact submission.

---

## 2. Admin Dashboard Verification

- [ ] **Sidebar Navigation:**
  - [ ] Persistent sidebar renders cleanly on desktop with active route highlights.
  - [ ] Mobile drawer toggles smoothly via hamburger button on smaller screens.
  - [ ] All 12 links navigate to correct paths without full-page flickering:
    1. Overview (`/admin`)
    2. Products (`/admin/products`)
    3. Categories (`/admin/categories`)
    4. Orders (`/admin/orders`)
    5. Payments (`/admin/payments`)
    6. Customers (`/admin/customers`)
    7. Coupons & Offers (`/admin/coupons`)
    8. Banners (`/admin/banners`)
    9. Service Inquiries (`/admin/inquiries`)
    10. Careers (`/admin/careers`)
    11. Analytics (`/admin/analytics`)
    12. Website Settings (`/admin/settings`)
- [ ] **Admin Features:**
  - [ ] Data tables include search, status badges, and pagination/scroll controls.
  - [ ] Payment verification interface allows staff to approve or reject pending bKash/Nagad/Bank payments.
  - [ ] Order status updater allows changing order state (Pending ➔ Processing ➔ Shipped ➔ Delivered).
  - [ ] Modal dialogs open and close cleanly with backdrop blur.

---

## 3. Technical & Cross-Device Compliance

- [ ] `npm run build` completes with 0 errors.
- [ ] `tsc --noEmit` completes with 0 TypeScript diagnostics.
- [ ] Browser console has 0 unhandled runtime errors or missing key warnings.
- [ ] Responsive testing across:
  - Mobile (375px - 430px)
  - Tablet (768px - 1024px)
  - Desktop (1280px - 1920px)
- [ ] Colors comply with WCAG AA accessibility contrast ratios.
