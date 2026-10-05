---
name: publish
description: Video steps 10–11 — put the work live and get it into Google, for any platform: publish drafts (Shopify/WordPress/static site via GitHub + Vercel), then Google Search Console verification, sitemap submission and "Request indexing", Google Business Profile, Google Analytics. Use when the user types /publish, says go live, deploy, launch, or asks how to get pages into Google.
argument-hint: "[project]"
---

# /publish

1. `npm run check` on every draft that goes out (0 errors, no ⚠️ placeholders left) and `npm run cadence -- --project <p>`.
2. **Publish by platform:**
   - **Static site** (`/build-site`): `npm run build` in `projects/<p>/site`, push to the project's GitHub repo; Vercel (preset Next.js, env `NEXT_PUBLIC_SITE_URL`) deploys. First time: follow `projects/<p>/site/docs/DEPLOY.md`.
   - **Shopify:** Shopify connector → create/update blog article, page, collection or product SEO fields. Before launch: remove password protection (Online Store → Preferences).
   - **WordPress:** REST API with WP_USER/WP_APP_PASSWORD, or a paste file.
   - **Other (Salla, Zid, Wix…):** paste file with field → value.
3. **Google (once per site):** Search Console → URL-prefix property → HTML-tag verification (put the tag in the platform/theme or `site.config.ts`) →
   Sitemaps → submit `sitemap.xml`. Connect Google Analytics 4 too.
4. **Each new page:** Search Console → URL Inspection → Request indexing (≈10/day; money pages first). Log with `npm run cadence -- --project <p> --log <url>`.
5. **Local businesses:** Google Business Profile with the exact same name, address, phone as the site.
6. Report the live URLs and what the user must click themselves.
