---
name: fix
description: Fix the SEO problems found by /audit on the site itself — titles, meta descriptions, H1s, alt texts, thin content, broken links, missing schema, keyword gaps — using the platform connector or API when available, otherwise copy-paste-ready changes; then re-check that each fix worked. Use when the user types /fix, says fix it, solve the problems, or apply the audit.
argument-hint: "[project] [problem id or 'top']"
---

# /fix — Fix, then Check

1. Load the latest `projects/<p>/reports/issues-<date>.json` (run `/audit` first if there is none). Work in severity order, or on what the user named.
2. **Plan** — show the user a short table: problem · pages · exact change. Get a go-ahead for anything touching more than ~10 pages
   or anything live (rule 4 in CLAUDE.md). Critical items you cannot change yourself (e.g. Shopify password page) → give the exact click path.
3. **Write the fixes** in the brand voice and project language, facts only from `brand.md`:
   - Titles 30–60 chars, main keyword first, unique · descriptions 110–160 chars with a reason to click.
   - H1 = page title with keyword · alt text describes the image in the page language.
   - Thin pages: add what/who/how/FAQ text; product facts only if confirmed.
   - Keyword gaps: informational → `/write`; buying intent → collection/product/service page draft.
4. **Apply** by publish method:
   - **Shopify connector:** update product/collection/page SEO title, description, handle (only if not yet indexed), alt text, body. Keep new pages unpublished/draft unless the user said publish.
   - **WordPress API:** update via REST (posts/pages, Yoast/RankMath meta fields if exposed).
   - **Static/git:** edit the files, build, commit on a branch.
   - **Manual:** write `projects/<p>/content/fixes-<date>.md` with a table "page → field → new value" ready to paste.
5. **Check:** re-crawl the changed URLs (or `npm run check -- <url>`) and confirm each fix. Mark each item ✅ fixed / ⏳ waiting (e.g. needs user) / ❌ failed.
6. Report the before → after for each item and what is left for the user.
