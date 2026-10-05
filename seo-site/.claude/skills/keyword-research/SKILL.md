---
name: keyword-research
description: Find winning SEO keywords for blog posts and service pages in Arabic and English — low difficulty, real volume, right intent — and save them to data/keywords.csv and data/service-keywords.csv. Uses the Semrush MCP connector if available, otherwise guides a Semrush CSV export. Use when the user types /keyword-research, asks for keywords, keyword ideas, or what to write about.
argument-hint: "[seed keyword] [--country sa|ae|us...]"
---

# /keyword-research — find the needles in the haystack

Not every keyword is equal. Claude guessing "20 keywords for plumbing" is not research — we need real volume and difficulty data.

## Data source
1. **Semrush MCP connected?** (tools like `keyword_research` / `execute_report`) → use it directly. Database: `sa` for Arabic
   (or the user's country), `us`/`uk`/... for English. Ask the user only if the country is unclear.
2. Otherwise: ask the user to export from Semrush → Keyword Magic Tool → filters below → add to Keyword Strategy Builder →
   Export CSV, and drop the file into `data/`.

## The 4 ways to find keywords (do all 4, both languages)
1. **Root keyword** (e.g. `plumber`, `سباك`) in Keyword Magic Tool.
2. **Questions** tab — great blog topics ("how much does a plumber cost").
3. **Adjacent topics** — the same audience, earlier in the funnel (water heater tips, signs of a leak, seasonal maintenance).
4. **Competitors** — Organic Research on 2–3 competitor domains → keywords they rank for that we don't.

## Filters
- Blog list: Keyword Difficulty **≤ 30**, Volume **≥ 100**, Intent **Informational**.
- Service list: Intent **Commercial/Transactional**, pattern **service + city** (or service + neighborhood), sorted by **CPC** (high CPC = money keyword). Volume ≥ 10 is fine locally.
- Remove: other businesses' names (search the term if unsure — if results are a company, drop it), job-seeker terms
  ("how to become a plumber", "plumber salary"), DIY-supply shopping terms, anything off-topic.

## Output
Append (don't overwrite, dedupe by keyword) to:
- `data/keywords.csv` — columns `Keyword,Intent,Volume,Keyword Difficulty,CPC (USD),lang`
- `data/service-keywords.csv` — same columns.
Remove the demo rows the first time real data is added.

Then show the user the top 10 blog keywords and top 10 service keywords per language (`npm run next-keyword` and
`npm run next-keyword -- --type service`), and suggest a 2-week plan that respects `npm run cadence`.
