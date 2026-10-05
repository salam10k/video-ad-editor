---
name: audit
description: Analyze any website or store for SEO problems and opportunities — crawl, Lighthouse, keyword coverage and competitor gaps — and produce a prioritized report with a concrete fix for each problem. Use when the user types /audit, asks to analyze/check/review a site, asks why a site does not rank, or before /fix.
argument-hint: "[project]"
---

# /audit — Analyze

1. Read `projects/<p>/project.json` and `brand.md`.
2. **Crawl:** `npm run crawl -- --project <p>` then `npm run audit -- --project <p>`.
   If the crawl cannot reach the site from this machine, read the key pages with Firecrawl and audit them by hand with the same rules.
3. **Search Console** (only if the user pastes or exports it): queries in position 5–20 with impressions = fastest wins.
4. **Lighthouse:** `npm run lighthouse -- --project <p>` (home + one page per template). Templates matter more than single pages.
5. **Intent check** on the top 5 keyword gaps: search each and look at the top 10 — shops/products = buying intent, articles = informational.
6. **Competitors:** for 1–2 competitors, what keywords/pages do they have that the project lacks (read their sitemap and top pages; Semrush if connected).
7. Write `projects/<p>/reports/audit-<date>.md` (the script creates the base; add sections for steps 3–6) with:
   score · 🔴 critical first (e.g. password page, robots block, noindex) · each problem → exact fix on this platform ·
   keyword gaps with the right page type · top 10 actions in order of impact/effort.
8. Log the run in Notion (`/log`). Tell the user the score, the 3 most important problems in plain words, and offer `/fix`.
