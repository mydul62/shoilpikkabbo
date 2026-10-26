# SHOILPIKKABBO — Design System & Visual Specification

## 1. Brand Philosophy & Identity

**Brand Name:** SHOILPIKKABBO  
**Core Motto:** Delivery • Quality • Reliability  
**Visual Aesthetic:** Refined, artisanal, and trustworthy. The platform balances traditional Bengali craftsmanship and modern industrial efficiency with a timeless, high-end commerce design language.

---

## 2. Color Palette & Design Tokens

### Primary Palette
| Token Name | Hex Code | HSL Value | Purpose / Usage |
| :--- | :--- | :--- | :--- |
| `brand-forest-900` | `#0f281e` | `hsl(156, 45%, 11%)` | Deep brand background, heavy contrast headers |
| `brand-forest-800` | `#1b4332` | `hsl(154, 42%, 18%)` | Primary brand color, primary buttons, active sidebar tabs |
| `brand-forest-700` | `#2d6a4f` | `hsl(153, 40%, 30%)` | Secondary brand action, hover states |
| `brand-forest-100` | `#e8f3ee` | `hsl(153, 30%, 93%)` | Subtle brand badges, active icon backgrounds |

### Warm Neutral Palette
| Token Name | Hex Code | HSL Value | Purpose / Usage |
| :--- | :--- | :--- | :--- |
| `brand-ivory` | `#fdfbf7` | `hsl(40, 50%, 98%)` | Main application background (storefront) |
| `brand-surface` | `#ffffff` | `hsl(0, 0%, 100%)` | Card surface, modal surface, admin white background |
| `brand-sand` | `#f5f0e8` | `hsl(38, 30%, 93%)` | Secondary panels, subtle card backgrounds |
| `brand-border` | `#e7dfd5` | `hsl(34, 25%, 87%)` | Standard container borders, dividers, table borders |

### Typography & Text Palette
| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| `brand-charcoal-900` | `#141414` | Primary high-contrast text, headings |
| `brand-charcoal-700` | `#383838` | Body text, readable descriptions |
| `brand-charcoal-500` | `#6b6b6b` | Secondary text, captions, timestamps |
| `brand-charcoal-300` | `#a3a3a3` | Placeholder text, disabled labels |

### Accent & Status Palette
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `brand-gold-600` | `#c59b27` | Primary accent, star ratings, promo badges |
| `brand-gold-100` | `#fdf7e7` | Gold highlight badge background |
| `status-success` | `#15803d` | Delivered orders, verified payments, in-stock badge |
| `status-warning` | `#b45309` | Pending orders, manual verification required |
| `status-danger` | `#b91c1c` | Cancelled orders, out of stock, destructive actions |
| `status-info` | `#0369a1` | Processing orders, transit status, inquiries |

---

## 3. Typography Scale

- **Heading Font:** `Outfit`, sans-serif (Clean, modern geometric balance)
- **Body Font:** `Inter`, sans-serif (High legibility at all screen sizes)

| Level | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| Display | 2.5rem (40px) - 3.25rem (52px) | 700 / Bold | 1.15 | Hero headlines, landing promos |
| H1 | 2rem (32px) - 2.25rem (36px) | 700 / Bold | 1.25 | Page titles, major category titles |
| H2 | 1.5rem (24px) - 1.75rem (28px) | 600 / SemiBold | 1.3 | Section headers, product names |
| H3 | 1.25rem (20px) | 600 / SemiBold | 1.4 | Card headers, modal titles |
| Body | 1rem (16px) | 400 / Normal | 1.5 | Standard copy, product descriptions |
| Small | 0.875rem (14px) | 400 / 500 | 1.4 | Badges, table cells, form labels |
| Micro | 0.75rem (12px) | 500 / Medium | 1.3 | Timestamps, SKU codes, fine print |

---

## 4. UI Components Specification

### 1. Buttons
- **Primary:** Background `brand-forest-800`, text `white`, hover `brand-forest-700`, active scale `0.98`.
- **Secondary / Outline:** Border `brand-forest-800`, text `brand-forest-800`, hover background `brand-forest-100`.
- **Accent:** Background `brand-gold-600`, text `white`, hover brightness 95%.
- **Ghost:** Transparent background, hover `brand-sand`, text `brand-charcoal-700`.

### 2. Product Cards
- Clean border `brand-border`, subtle hover shadow `shadow-md`, transition `transform 200ms ease`.
- High-res image with aspect ratio 1:1, quick add-to-cart button, price badge, rating stars.

### 3. Admin Sidebar
- Persistent 260px desktop width, dark forest green (`brand-forest-900`) or clean crisp white with deep forest accents.
- Active route indicator with `brand-forest-800` background and gold highlight dot.
- Collapsible on desktop, smooth overlay drawer on mobile.
