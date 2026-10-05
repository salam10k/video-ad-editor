# Go live (free): GitHub → Vercel → Google

## 1. GitHub (stores your code)
1. github.com → **New repository** → name it (e.g. `my-seo-site`) → **Private** → Create.
2. Copy the repo URL, then in Claude Code (opened in this `seo-site` folder):
   > Upload my whole project to this GitHub repo: https://github.com/you/my-seo-site.git

## 2. Vercel (hosts the site)
1. vercel.com → sign up with GitHub (free).
2. **Add New → Project** → import the repo.
3. Framework preset: **Next.js** (auto-detected). Root directory: the folder that contains `package.json`.
4. Environment Variables: `NEXT_PUBLIC_SITE_URL` = your final URL (e.g. `https://my-seo-site.vercel.app` or your domain).
5. **Deploy**. ~60 seconds later the site is live. Every `git push` redeploys automatically.
6. Own domain: Project → Settings → **Domains** → add it (buy in Vercel, or point DNS from Namecheap etc.).
   Then update `NEXT_PUBLIC_SITE_URL` and redeploy.

## 3. Google Business Profile (free local listing)
business.google.com → create/claim your listing. Use **exactly** the same name, address and phone as `site.config.ts`.
Add the website URL. This is the lowest-hanging fruit for local clicks (the map results).

## 4. Google Search Console (tells Google your pages exist)
1. search.google.com/search-console → **Add property** → **URL prefix** → paste your full URL (with https:// and trailing /).
2. Verification → **HTML tag** → copy only the `content="..."` value → tell Claude:
   > Put this Google verification code in site.config.ts and publish: <code>
3. After deploy, click **Verify**.
4. **Sitemaps** → enter `sitemap.xml` → Submit.
5. For each new page: paste its URL in the top search bar (URL Inspection) → **Request indexing**.
   Pages can appear within a day instead of weeks. Limit ≈ 10 requests/day.

## 5. Google Analytics 4 (optional)
analytics.google.com → create property → Web stream → copy the Measurement ID (`G-…`) → put it in `site.config.ts` → `gaId`.

## 6. Lead form (optional)
Create a form endpoint (Formspree, or a Make.com / Zapier / n8n webhook that forwards to email/WhatsApp/Sheets),
put the URL in `site.config.ts` → `leadFormEndpoint`. Empty = call + WhatsApp buttons instead.

## 7. Test landing pages
Run a small Google Ads budget to 2–5 variations of the homepage/service page layout, keep the one with the best
conversion rate, and apply it to every service page (they all share one template, so one change updates all).
