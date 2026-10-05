---
name: service
description: Video step 6 — create a "money page" that targets buying-intent keywords, adapted to the project type: service × city landing page for local businesses, collection/category page for shops, product page copy, or a landing page for a campaign keyword. Uses the homepage's proven layout, real keyword data sorted by CPC, unique content, then /check. Use when the user types /service, asks for a service page, city page, landing page, collection or category page.
argument-hint: "[project] [keyword or service + city]"
---

# /service — money pages for any project

1. **Find money keywords:** `keywords.csv` rows with buying intent, sorted by CPC (what advertisers pay = money). Real data only (keywords.csv / Semrush).
   Confirm intent on live results (shops/providers in the top 10).
2. **Pick the page type by project type:**
   | Project | Page | Pattern |
   |---|---|---|
   | Local service | Service × city landing page ("the zipper") | `<service> <city>` |
   | Shop | Collection / category page | `<product type> <attribute>` (e.g. "maldecke", "kuscheldecke personalisiert") |
   | Shop, single hero product | Product page title, description, FAQ | product keyword |
   | Campaign / gift season | Landing page | `<occasion> <audience>` (e.g. "geschenk 6 jährige") |
   Don't mass-produce near-duplicates — only pages with real demand.
3. **Layout:** reuse the page that converts best (homepage or best product page): headline with keyword, proof (real only), CTA above the fold, benefits, how it works, FAQ, CTA.
4. **Write** `projects/<p>/content/<slug>.<lang>.md` with `kind: page` (or `product`/`collection`) front matter, in brand voice, facts only from `brand.md`.
5. `npm run check -- <file> --kind page` → 0 errors except open ⚠️ placeholders.
6. Publish per platform (Shopify connector: collection/page as draft · WordPress API · static site: `content/services/<lang>/` · manual paste file), log with cadence, and link to it from 1–2 related blog posts.
