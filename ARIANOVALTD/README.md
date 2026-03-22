# Arianova B2B Platform
A premium wine distribution platform built with Next.js 16 (Turbopack), Tailwind CSS, Clerk Authentication, and Sanity CMS.

The application serves as a dedicated B2B logistics and distribution portal, connecting celebrated heritage estates (such as Tenute Dello Jato and Tenute Fosca) directly with professional retail markets.

## Key Features
- **Sanity CMS Integration**: Dynamic inventory management tracking physical and committed stock.
- **Stripe Webhooks**: Secure checkout and payment processing logic.
- **Visual Scarcity Engine**: Real-time stock alerts native to the UI based on inventory thresholds.
- **Distribution Model UI**: Completely responsive, luxury aesthetic leveraging Framer Motion and Next.js server-side rendering.

## Setup Instructions
To run this project locally, ensure you have the required environment variables:
`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_WRITE_TOKEN`
`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

```bash
npm install
npm run dev
```

*Note: For Next.js 16 routing configuration, ensure `src/proxy.ts` is configured instead of `middleware.ts` to prevent Turbopack deprecation panics.*
