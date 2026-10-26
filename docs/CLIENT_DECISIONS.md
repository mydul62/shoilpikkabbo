# SHOILPIKKABBO — Client Decisions & Configuration Log

This document tracks client-approved configurations and items pending client sign-off or credential delivery.

---

## 1. Verified & Approved Client Information

| Item | Approved Value | Status |
| :--- | :--- | :--- |
| **Business Name** | SHOILPIKKABBO | Verified |
| **Motto / Tagline** | Delivery • Quality • Reliability | Verified |
| **Official Email** | shoilpikkabbo@gmail.com | Verified |
| **Customer Support Phone 1** | `+880 1731214379` | Verified |
| **Customer Support Phone 2** | `+880 1811909068` | Verified |
| **Manual Payment Verification Phone** | `+880 1977765999` (bKash / Nagad) | Verified |
| **Bank Name** | BRAC Bank PLC | Verified |
| **Primary Language** | English (Bangla ready) | Verified |

---

## 2. Pending Client Decisions & Assets

The following items are configured with safe, realistic development placeholders until client credentials or final assets are supplied:

### 2.1 Payment Gateway
- **Status:** Pending Merchant Agreement
- **Temporary Strategy:** Two-tiered checkout. Manual bKash, Nagad, and BRAC Bank Transfer with customer Transaction ID input + Cash on Delivery. Online payment gateway triggers a "Coming Soon / Testing Mode" banner until credentials (Store ID / Merchant API Key) are provided.

### 2.2 Standard Delivery Charges
- **Inside Dhaka:** Default placeholder: `৳70`
- **Outside Dhaka:** Default placeholder: `৳130`
- **Free Delivery Threshold:** Default placeholder: Free delivery on orders over `৳3,000`

### 2.3 Official Brand Logo & Graphics
- **Current Approach:** Clean typography-based brand mark with custom icon badge in SVG using the brand color tokens (`#1b4332` forest green and `#c59b27` gold). Official vector logo file to replace placeholder when supplied.

### 2.4 Social Media & Messaging URLs
- **Current Approach:** Standard client contact numbers pre-populated into WhatsApp click-to-chat API (`https://wa.me/8801731214379`). Facebook & Messenger links point to verified handle once confirmed.

### 2.5 Active Job Vacancies
- **Current Approach:** Display curated initial vacancies (e.g., "Senior Quality Assurance Officer - Textiles/Handicraft", "Junior Digital Marketing Specialist") with an open application option for general resumes.

### 2.6 Cloud Hosting & Media Storage
- **Frontend Target:** Vercel or Node.js VPS
- **Backend Target:** Node.js VPS or Dockerized container
- **Database Target:** Managed PostgreSQL (e.g., Neon / Supabase / AWS RDS / Self-hosted)
- **Object Storage for Images:** Cloudinary or AWS S3 / MinIO
