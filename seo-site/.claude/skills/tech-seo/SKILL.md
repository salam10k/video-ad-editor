---
name: tech-seo
description: Technical SEO pass — verify static generation, sitemap.xml, robots.txt, canonical/hreflang, structured data, and get Google Lighthouse to 100 in performance, accessibility, best practices and SEO. Use when the user types /tech-seo, pastes a Lighthouse/PageSpeed report, or asks about site speed, Core Web Vitals, sitemap or robots.
---

# /tech-seo — Lighthouse 100/100/100/100

1. `npm run build` must succeed and every route in the output must be `○ (Static)` or `● (SSG)`. Anything dynamic → fix it.
2. Check `out/sitemap.xml` lists every page in both languages with hreflang, and `out/robots.txt` links the sitemap.
   `NEXT_PUBLIC_SITE_URL` in `.env` / Vercel must be the real domain, otherwise canonicals point to example.vercel.app.
3. Run `npm run lighthouse` (needs Chrome; set `CHROME_PATH` if not found).
   If the user pasted a report instead (Chrome DevTools → Lighthouse, or pagespeed.web.dev), use that.
4. Fix every failing audit, keeping the design and content intact. Typical fixes: image sizes/compression, missing
   width/height, contrast, label/heading order, render-blocking resources, unused JS, long cache TTL (Vercel handles it in production).
5. Rebuild and rerun until every category is 100 (98–99 on performance is acceptable when it's only lab noise; say so).
6. Walk through `seo/technical-checklist.md` and report what's done and what the user must do in Search Console.
