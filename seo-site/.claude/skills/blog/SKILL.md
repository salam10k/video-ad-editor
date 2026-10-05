---
name: blog
description: Write and publish one SEO blog post in Arabic and English — picks an unused keyword, builds a keyword cluster, copies the winning format of the top 3 Google results, writes in the owner's voice and humor, adds Pexels images, applies the 80+ on-page checklist, and verifies the build. Use when the user types /blog, asks for a new blog post or article, or wants daily content.
argument-hint: "[keyword] [--lang ar|en] [--draft]"
---

# /blog — one ranking blog post, both languages

Do every step in order. Don't skip the research steps: they are what makes the post rank.

## 0. Speed limit
Run `npm run cadence`. If `canPublish` is false, still write the post but set `draft: true` in both files and tell the user
it's queued for tomorrow. Never publish bursts — Google notices spikes.

## 1. Keyword
- If the user gave a keyword, use it. Otherwise run `npm run next-keyword -- --limit 5` and take the top result
  (prefer the language the user asked for; default: alternate languages day to day).
- Keep it: KD ≤ 30, volume ≥ 100, informational intent, not a competitor brand, not "how to become a <trade>"
  (that audience competes with you, it doesn't hire you).
- The **other language** gets its own real keyword for the same topic: check the CSV for a matching row in that language;
  if none, use the Semrush MCP tool (`keyword_research`) when available, otherwise pick the most natural search phrase.

## 2. Keyword cluster (per language)
3–8 related keywords: similar rows from `data/keywords.csv`, Semrush "Questions" for the topic, Google "People also ask",
and natural variants. These go into `keywords:` and into H2s, body, alt text and FAQ.

## 3. Steal the winning format
- Search Google for the primary keyword (WebSearch, or Firecrawl/Perplexity tools if connected).
- Take the **top 3 organic articles** — skip Reddit, Quora, YouTube, forums, marketplaces and giant directories.
- Run `npm run analyze-serp -- <url1> <url2> <url3>` (if fetching is blocked, read the pages with WebFetch and measure manually).
- Record the average: `targetWords`, number of H2s, images, lists/tables, FAQ yes/no, and the subtopics all three cover.
- Your post must cover all shared subtopics **plus** at least one thing they all miss (a story, a real stat, an honest opinion).

## 4. Read the references
Read all of `references/voice.md`, `humor.md`, `opinions.md`, `stats.md`, `stories.md`. Only use stats and stories that are written there.

## 5. Images
`npm run pexels -- "<short english query>" <slug> 3` → use image 1 as `cover`, the others inline near the relevant text.
Rewrite alt texts in each page's language with a cluster keyword where natural. Without a PEXELS_API_KEY,
skip images, tell the user how to add the key (`.env`), and continue.

## 6. Write both files
- `content/blog/ar/<slug>.md` and `content/blog/en/<slug>.md` — **same slug** (latin, kebab-case, from the English keyword), same `translationKey`.
- Copy the front matter structure from `content/blog/ar/_template.md`. Add `targetWords:` from step 3.
- Body: no H1. First 50 words = hook (humor rule). Primary keyword in the first 100 words. H2s from step 3.
  3–5 internal links (most relevant service page, related posts, `/ar/services/`, `/ar/blog/`) in the same language,
  2–3 external authoritative links, a blockquote with the best tip, a bottom-line section that calls back to the opening joke.
- FAQ: 4–8 real questions in front matter (they render as FAQ + FAQPage schema automatically).
- The other language is a localized rewrite (its own jokes, its own keyword), not a translation.
- Do **not** touch the page templates in `app/` — the technical SEO is already optimized and must stay identical.

## 7. On-page SEO pass
Go through `seo/on-page-checklist.md` item by item while keeping the voice and humor intact
(balance: SEO markers *and* enjoyable to read). Then run:
```bash
npm run check-seo -- content/blog/ar/<slug>.md content/blog/en/<slug>.md
```
Fix every ERROR, and every WARN that is reasonable. Repeat until clean.

## 8. Interlink
Add a link to the new post from 1–2 older related posts (same language) where it fits naturally.

## 9. Build & log
```bash
npm run build
node scripts/cadence.mjs --log blog ar <slug> "<ar keyword>" <translationKey>
node scripts/cadence.mjs --log blog en <slug> "<en keyword>" <translationKey>
```
(Skip logging for drafts.)

## 10. Report
Tell the user: keywords (ar/en), the top-3 formula you matched, word counts, check-seo result, and the local URLs
(`/ar/blog/<slug>/`, `/en/blog/<slug>/`). Offer `/publish` to put it live.
