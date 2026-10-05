---
name: service
description: Create one high-converting local service page (service × city) in Arabic and English, using the homepage layout, a money keyword with real search demand, unique local content, and the full on-page checklist. Use when the user types /service or asks for a service page, city page, landing page for a service, or "service in city" page.
argument-hint: "[service-key] [city-key]"
---

# /service — one service × city page, both languages

Think of a zipper: services on one side, cities on the other. Each page zips one service to one city.
Only build pages where people actually search — a few strong pages beat hundreds of thin ones (Google can treat mass near-duplicates as spam).

## 1. Pick the page
- If the user named a service and city, use them (keys from `site.config.ts`; add the service/city there first if missing).
- Otherwise run `npm run next-keyword -- --type service` (sorted by CPC = what advertisers pay = money keywords) and take the top unused one.
- Check `content/services/<lang>/` so you never duplicate a service+city pair.
- Speed limit: `npm run cadence` (same rule as blog posts).

## 2. Keywords
Primary keyword = the "service city" phrase people search, per language (e.g. `سباك طوارئ الرياض` / `emergency plumber Riyadh`).
Cluster: "near me", "24 hour", price, neighborhood variants.

## 3. Research
Search the keyword, open the top 3 local business pages (not directories), and note what they show:
prices, guarantees, areas served, FAQ, trust signals. Beat them on clarity and honesty.

## 4. Write both files
`content/services/ar/<service>-<city>.md` and `content/services/en/<service>-<city>.md`, same `translationKey`,
with `service:` and `city:` keys matching `site.config.ts`. Copy the structure of `content/services/ar/emergency-plumbing-riyadh.md`.
- The page uses the homepage layout automatically (hero + call button + lead form + stats + steps + FAQ + CTA) —
  that layout is the tested converter. **Do not edit `app/[lang]/services/[slug]/page.tsx`.**
- Content must be **unique to this city**: neighborhoods served, local conditions (water hardness, old buildings,
  summer heat…), real arrival times from `references/stats.md`. Never just swap the city name.
- 300+ words, 2+ H2s, 3–6 FAQ, 2+ internal links (a related blog post, `/services/`, home), 0–2 external links.
- Voice and humor from `references/` (lighter than blog posts — this page sells).

## 5. Check, build, log
```bash
npm run check-seo -- content/services/ar/<slug>.md content/services/en/<slug>.md
npm run build
node scripts/cadence.mjs --log service ar <slug> "<ar keyword>" <translationKey>
node scripts/cadence.mjs --log service en <slug> "<en keyword>" <translationKey>
```
Link to the new page from the most relevant blog post(s). Report and offer `/publish`.
