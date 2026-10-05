# Technical SEO checklist

Most of this is already built into the templates. Re-check after any change to `app/` or `components/`.

## Crawling & indexing
- [x] Static Site Generation (`output: 'export'`) — full HTML for every URL, no client-side rendering of content.
- [x] `sitemap.xml` generated from all content, with hreflang alternates (`app/sitemap.ts`).
- [x] `robots.txt` allows everything except `/admin/` and `/api/`, and links the sitemap (`app/robots.ts`).
- [x] Canonical URL on every page.
- [x] hreflang `ar`, `en`, `x-default` on every page and in the sitemap.
- [x] Trailing-slash URLs everywhere (consistent canonicals).
- [x] `/` redirects 301 to `/ar/` (vercel.json).
- [x] Custom 404 page.
- [ ] Submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console.
- [ ] "Request indexing" for every new page (about 10 per day allowed).

## Lighthouse (target: 100 / 100 / 100 / 100)
Run `npm run build && npm run lighthouse`, or Chrome → ⋮ → More tools → Developer tools → Lighthouse → Analyze page load.
Paste any failing audits into Claude: "Here's my Lighthouse report, get every category to 100."

Performance:
- [x] No render-blocking web fonts (system font stack).
- [x] No client-side JavaScript for content; forms are plain HTML.
- [x] Images have width/height (no layout shift), lazy-loaded below the fold, cover image `fetchpriority="high"`.
- [x] Analytics loads `lazyOnload`.
- [ ] Images under ~200 KB each (Pexels landscape/large sizes).

Accessibility:
- [x] `lang` and `dir` on `<html>` per language.
- [x] Color contrast ≥ 4.5:1 for text.
- [x] Form inputs have labels; buttons have text.
- [x] Visible focus styles; heading order without skips.

Best practices:
- [x] HTTPS (Vercel), no console errors, `rel="noopener"` on external links.

SEO:
- [x] Meta description, title, crawlable links, valid hreflang, valid structured data.
- [ ] Test structured data: https://search.google.com/test/rich-results

## Core Web Vitals (field data, Search Console → Experience)
- LCP < 2.5 s · INP < 200 ms · CLS < 0.1
