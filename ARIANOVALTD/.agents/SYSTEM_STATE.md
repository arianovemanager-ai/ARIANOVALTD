# AriaNova System State

This file tracks the status of integrations, design standards, and architectural drift against the guidelines in [.agents/ARCHITECTURE.md](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/.agents/ARCHITECTURE.md).

| Status | ID | Description |
| :--- | :--- | :--- |
| **[RESOLVED]** | `AN-DRIFT-001` | **Orphan Sanity-to-Cin7 Push Webhook:** Resolved. The orphan webhook route directory `src/app/api/webhooks/sanity/stock-push` has been permanently deleted, and the schema description in [wineType.ts](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/sanity/schemaTypes/wineType.ts#L49) has been corrected to reference the pull-based sync cron job. |
| **[RESOLVED]** | `AN-DRIFT-002` | **Outdated Schema Field Description:** Resolved. In [wineType.ts](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/sanity/schemaTypes/wineType.ts#L49), the description of `physical_stock` has been updated to reference the active daily pull-based sync cron job. |
| **[RESOLVED]** | `AN-DRIFT-003` | **Broken Pre-flight Idempotency Check:** Resolved. Stripe Session ID is now mapped to `ExternalID` during Sales Order creation, and `checkSalesOrderExists()` checks `ExternalID` for matching sales, protecting the pre-flight idempotency guard. |
| **[ALIGNED]** | `AN-ALIGNED-001` | **Vercel Cron Schedules:** Active cron jobs in [vercel.json](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/vercel.json) match the registered schedules in Section 3 of [ARCHITECTURE.md](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/.agents/ARCHITECTURE.md) perfectly (`0 2 * * *`, `0 0 * * *`, `0 4 * * *`). |
| **[ALIGNED]** | `AN-ALIGNED-002` | **Compute on Write for User States:** Membership tiers and customer acquisitions are computed on the backend inside the Stripe webhook and synced to Clerk's `publicMetadata`. |
| **[ALIGNED]** | `AN-ALIGNED-003` | **Stripe Webhook Performance:** Asynchronous background syncs (Cin7, Slack, Resend) are offloaded to Next.js 15's native `after()` API to respond to Stripe in under 500ms. |
| **[ALIGNED]** | `AN-ALIGNED-004` | **Idempotency & Master Atomic Transactions:** Transactions on Sanity CMS are performed atomically via `writeClient.transaction()`, including creation of `sessionRecord` for idempotency checks. |
| **[ALIGNED]** | `AN-ALIGNED-005` | **Shipping Charges Injection:** Shipping charges are correctly mapped as an `AdditionalCharge` with the `'Tax on Sales'` TaxRule in [stripe/route.ts](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/app/api/webhooks/stripe/route.ts). |
| **[VERIFIED]** | `AN-CRON-001` | **Cron Job Schedule Check:** Confirmed 3 active cron jobs in vercel.json (/api/cron/cin7-retry, /api/cron/sync-delivery, /api/cron/sync-inventory). Schedules match ARCHITECTURE.md perfectly. |

---

## [SEO-DRIFT]

| Status | ID | Description |
| :--- | :--- | :--- |
| **[RESOLVED]** | `AN-SEO-001` | **Missing Page-Specific Metadata:** Resolved. Implemented dynamic and static page-specific metadata using `getSeoMetadata()` helper to ensure all public pages have unique title and description tags. |
| **[RESOLVED]** | `AN-SEO-002` | **Missing Product JSON-LD Schema:** Resolved. Implemented server-side injected Product and Offer JSON-LD schema using `getWineProductJsonLd()` helper to supply Google crawlers with dynamic pricing and inventory stock availability. |
| **[RESOLVED]** | `AN-SEO-003` | **Heading Hierarchy Violation:** Resolved. Converted Homepage and Wine Detail Page eyebrows from `h2` to `p` elements to prevent rendering above `h1`, and elevated `h3` subheadings (e.g. Specifications) to `h2` to guarantee strict heading levels. |
| **[RESOLVED]** | `AN-SEO-004` | **CSS Background Images Used for Visual Media:** Resolved. Refactored the Story page to replace legacy CSS background images with Next.js optimized `<Image />` components inside relative parent boundaries, satisfying image optimization and LCP policies. |
| **[RESOLVED]** | `AN-SEO-005` | **Missing Canonical Links:** Resolved. Implemented dynamic alternated canonical links generated dynamically per page to specify primary URL origin paths. |
| **[ALIGNED]** | `AN-SEO-006` | **LCP Image Priority:** The wine detail page ([page.tsx:L44](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/app/wines/[slug]/page.tsx#L44)) correctly applies the `priority` flag to the main product image for LCP optimization. |

---

## Resolution Audit Log

- **2026-05-24:** Resolved `AN-DRIFT-003` (Broken Pre-flight Idempotency Check). Mapped `stripe_session_id` to `ExternalID` inside [route.ts](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/app/api/webhooks/stripe/route.ts) during sales order creation, and updated [checkSalesOrderExists()](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/lib/cin7.ts#L135-L163) in [cin7.ts](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/lib/cin7.ts) to query using `ExternalID`. Mocked Next.js 15 `after()` in [stripe-webhook.test.ts](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/tests/stripe-webhook.test.ts) to solve the async race condition in testing, and added unit tests in [cin7.test.ts](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/tests/cin7.test.ts) to assert the resolution.
- **2026-05-24:** Resolved `AN-DRIFT-001` (Orphan Webhook Removal). Verified no active code references exist for the `src/app/api/webhooks/sanity/stock-push` directory, permanently deleted the directory, and updated the schema description in [wineType.ts](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/sanity/schemaTypes/wineType.ts#L49) to refer to the pull-based inventory sync cron.
- **2026-05-24:** Resolved `AN-DRIFT-002` (Outdated Schema Description). Replaced legacy "Cin7 Core Webhooks" description in [wineType.ts](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/sanity/schemaTypes/wineType.ts#L49) with references to the active daily pull-based inventory sync cron.
- **2026-05-24:** Resolved `AN-SEO-001` & `AN-SEO-005` (Metadata & Canonical Foundation). Created [seo.ts](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/lib/seo.ts) containing the [getSeoMetadata()](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/lib/seo.ts#L15) helper. Configured static and dynamic metadata exports for the homepage, wines detail page, story page, and vineyard page, including dynamic canonical links.
- **2026-05-24:** Resolved `AN-SEO-003` (Heading Hierarchy Violation). Converted Homepage and Wine Detail Page eyebrows from `h2` to `p` tags to fix rendering sequence. Elevated "Specifications" heading on Wine Detail Page from `h3` to `h2` to prevent skipped heading levels.
- **2026-05-24:** Resolved `AN-SEO-002` (Missing Product JSON-LD Schema). Created [jsonld.ts](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/lib/jsonld.ts) containing [getWineProductJsonLd()](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/lib/jsonld.ts#L15) helper. Injected server-rendered `<script type="application/ld+json">` tag on the Wine Detail page to map dynamic product fields, offers, prices, and stock availability. Added [jsonld.test.ts](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/tests/jsonld.test.ts) to verify schema mapping.
- **2026-05-24:** Resolved `AN-SEO-004` (CSS Background Images Used for Visual Media). Refactored editorial layout images on the Story page ([page.tsx](file:///c:/Users/GGPC/Desktop/Arianova/ARIANOVALTD/src/app/story/page.tsx)) to load via Next.js optimized `<Image />` elements with dynamic sizes, maintaining visual layout ratios and border styling while eliminating un-optimized background styling.

