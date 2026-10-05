---
name: keywords
description: Keyword research for any project, market and language — real volumes and difficulty from OpenSEO (or Semrush), intent checked on live results, grouped by page type — saved to the project's keywords.csv. Use when the user types /keywords, asks what to write about, which keywords to target, or for a content plan.
argument-hint: "[project] [seed keyword]"
---

# /keywords

1. Seeds: the user's words, product/service names from `brand.md`, competitor pages.
2. Data (never invent numbers): OpenSEO `research_keywords` / `get_keyword_metrics` (location = project market, language = project language);
   `get_domain_keyword_suggestions` / `get_ranked_keywords` for competitors; Semrush if it has units.
3. The video's 4 ways: root keyword · questions · adjacent topics (same audience, earlier in the funnel) · competitor keywords.
4. Filter: blog → KD ≤ 30, volume ≥ 100, informational; money pages → buying intent, sorted by CPC. Drop competitor brand names and job-seeker terms.
5. **Intent check** the top candidates on live results (shops vs articles) and set `intent` + `target` page type.
6. Append to `projects/<p>/keywords.csv` (dedupe) and propose a 2-week plan that respects `npm run cadence`.
