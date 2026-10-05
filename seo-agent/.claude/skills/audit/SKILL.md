---
name: audit
description: Analyze any website or store for SEO problems and opportunities — crawl, OpenSEO site audit, Lighthouse, keyword coverage and competitor gaps — and produce a prioritized report with a concrete fix for each problem. Use when the user types /audit, asks to analyze/check/review a site, asks why a site does not rank, or before /fix.
argument-hint: "[project]"
---

# /audit — Analyze

1. Read `projects/<p>/project.json` and `brand.md`.
2. **Crawl:** `npm run crawl -- --project <p>` then `npm run audit -- --project <p>`.
   If the crawl cannot reach the site from this machine, run OpenSEO `run_site_audit` (ask first if it costs many credits)
   and read `get_audit_issues` / `get_audit_pages`; or read key pages with Firecrawl.
3. **OpenSEO data** (if connected): `get_project_context`; latest `get_audit_issues`; `get_ranked_keywords` for the domain;
   `get_search_console_performance` with `minPosition 5, maxPosition 20, minImpressions 50` ("striking distance" queries = fastest wins).
4. **Lighthouse:** `npm run lighthouse -- --project <p>` (home + one page per template). Templates matter more than single pages.
5. **Intent check** on the top 5 keyword gaps: search each and look at the top 10 — shops/products = buying intent, articles = informational.
6. **Competitors:** for 1–2 competitors, what keywords/pages do they have that the project lacks (OpenSEO `find_serp_competitors` / `get_domain_keyword_suggestions`, or read their sitemap).
7. Write `projects/<p>/reports/audit-<date>.md` (the script creates the base; add sections for steps 3–6) with:
   score · 🔴 critical first (e.g. password page, robots block, noindex) · each problem → exact fix on this platform ·
   keyword gaps with the right page type · top 10 actions in order of impact/effort.
8. Tell the user the score, the 3 most important problems in plain words, and offer `/fix`.
