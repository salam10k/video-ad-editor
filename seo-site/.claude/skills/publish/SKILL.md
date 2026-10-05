---
name: publish
description: Publish the site live — run checks, commit, push to GitHub so Vercel deploys, then guide Google Search Console sitemap submission and "Request indexing" for new pages. Use when the user types /publish, says deploy, go live, push, or put it online.
---

# /publish — from local to Google

1. `npm run check-seo` (0 errors) and `npm run build` (must pass). Stop and fix if not.
2. `git add -A && git commit -m "<what was added>"` then `git push`. Vercel (connected to the GitHub repo) deploys automatically in about a minute.
   First time? Follow `docs/DEPLOY.md` (GitHub repo → Vercel import, framework preset **Next.js**, env var `NEXT_PUBLIC_SITE_URL`).
3. List the new/changed URLs on the live domain and tell the user:
   - Search Console → URL Inspection → paste each new URL → **Request indexing** (limit ≈ 10/day; prioritize service pages).
   - First deploy only: Search Console → Sitemaps → submit `sitemap.xml`.
4. If `site.googleSiteVerification` is empty and the user hasn't verified the domain, explain the HTML-tag method:
   they paste the `content="..."` value, you put it in `site.config.ts`, then publish again.
