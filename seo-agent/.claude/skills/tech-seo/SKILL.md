---
name: tech-seo
description: Technical SEO for any site — Lighthouse (performance, accessibility, best practices, SEO), Core Web Vitals, sitemap, robots.txt, canonical, hreflang, structured data — find the causes and fix them on the platform, then re-measure. Use when the user types /tech-seo, pastes a Lighthouse/PageSpeed report, or asks about speed or indexing.
argument-hint: "[project]"
---

# /tech-seo

1. `npm run lighthouse -- --project <p>` (or use a pasted report / pagespeed.web.dev). After launch also check Search Console → Experience (Core Web Vitals).
2. Group failing audits by cause (images, apps/scripts, fonts, theme code, contrast, headings, links).
3. Fix by platform: Shopify → compress/resize images, remove unused apps, theme settings, lazy-load; WordPress → caching/image plugins, theme;
   static → code. Explain what needs a developer or theme change.
4. Verify sitemap (submitted in Search Console), robots.txt, canonical, hreflang per language, JSON-LD (rich results test).
5. Re-run Lighthouse and report before → after per template.
