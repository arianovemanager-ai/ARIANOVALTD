# Arianova | Luxury Wine Distribution Portal

A bespoke, high-end B2B platform built for the digital age. Arianova connects heritage Italian estates directly with professional retail and hospitality markets through a seamless, neoclassical minimalist interface.

## 🍷 The Journey
This project was transformed from a standard template into a premium luxury experience, featuring:
- **Neoclassical Aesthetics**: A curated palette of Deep Burgundy (`#4A0404`), Antique Cream (`#F9F6EE`), and Harvest Gold (`#B8860B`).
- **Dynamic Scarcity**: Real-time inventory management powered by Sanity CMS.
- **Global Compliance**: Integrated Stripe for secure, B2B-ready checkout.

## 🛠 Technical Stack
- **Framework**: Next.js 16 (Turbopack) with App Router.
- **Styling**: Vanilla CSS & Tailwind with custom luxury design tokens.
- **Auth**: Clerk (Custom B2B "Trade Account" flow).
- **CMS**: Sanity.io (Inventory, Partner Estates, Wine Archives).
- **Payments**: Stripe (Webhooks for inventory synchronization).
- **Email**: Resend (Automated receipts and allocation confirmations).
- **Motion**: Framer Motion for tactile, immersive transitions.

## 🚀 Deployment Highlights
Successfully deployed to **Vercel** with full environmental security and webhook verification:
- **Webhook Integration**: Real-time synchronization between Stripe/Clerk and the Sanity backend.
- **Mobile First**: Bespoke animated hamburger menu for seamless collection browsing on all devices.
- **SEO Optimized**: Semantic HTML and premium metadata for brand authority.

## 🏁 Setup & Installation
1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Environment Configuration**:
   Ensure your `.env.local` contains valid Clerk, Stripe, Sanity, and Resend keys.
3. **Run Development**:
   ```bash
   npm run dev
   ```

---
*Created with focus on visual excellence and technical precision.*
