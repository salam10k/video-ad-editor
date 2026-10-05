---
name: write
description: Write one SEO blog post for any project, in its language and brand voice — real keyword data, intent check, top-3 format analysis, keyword cluster, images, FAQ, internal links — save it as a draft or publish it on the project's platform, then check it. This is the video's /blog pipeline for any site. Use when the user types /write or /blog in this folder, or asks for an article/blog post for a project.
argument-hint: "[project] [keyword]"
---

# /write — the /blog pipeline for any project

1. **Cadence:** `npm run cadence -- --project <p>`. If the quota is used, write it as a draft for tomorrow.
2. **Keyword:** user's choice, else the best unused informational row in `keywords.csv` (no `target` page yet). Real numbers only.
3. **Intent check:** search it in the project's country. If the top 10 are shops, it is a buying keyword → tell the user it belongs on a product/collection page
   and pick the informational sibling keyword instead (e.g. "textilstifte waschfest" → "textilstifte fixieren").
4. **Top 3 format:** read the top 3 organic articles (skip YouTube, Reddit, forums, marketplaces). `npm run serp` or Firecrawl.
   Record average length, H2s, images, tables, FAQ, and the subtopics they share. Find what they all miss — usually the project's own angle.
5. **Brand:** read `brand.md`. Voice, form of address, forbidden claims. Facts only from there; else `⚠️` markers.
6. **Write** `projects/<p>/content/<slug>.<lang>.md` with front matter:
   `kind: blog, lang, title, metaTitle, description, slug, primaryKeyword, keywords[], targetWords, cover{src,alt}, faq[{q,a}]`
   and the body in Markdown (no H1). Hook in the first 50 words, keyword in the first 100, H2s from step 4, 3–5 internal links
   (from `project.json` internalLinks), 2–3 authoritative external links, a best-tip blockquote, a conclusion that calls back to the hook.
   One file per language; each language is a native rewrite with its own keyword.
7. **Images:** Pexels (`PEXELS_API_KEY`) or the user's own photos; alt text in the page language.
8. **Check:** `npm run check -- projects/<p>/content/<slug>.<lang>.md` until 0 errors except open `⚠️` placeholders, which you list for the user.
9. **Publish** per `project.json` → publish.method (Shopify connector: blog article as draft; WordPress API: draft; git; or manual paste).
   Log it: `npm run cadence -- --project <p> --log <slug> --key <slug>`.
10. **Report:** keyword + why (intent), top-3 formula, word count, check result, open placeholders, where the draft is.
