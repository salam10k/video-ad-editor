---
name: setup
description: First-time setup — turns this general template into the user's own business website by asking a few questions (business type, name, services, cities, contact, colors, real stats) and then rewriting site.config.ts, the UI copy, colors, references, keyword lists and the sample content. Use when the user types /setup, says "make it my site", "change it to my business", or the site still shows "اسم نشاطك / Your Business".
---

# /setup — from general template to your business in one conversation

## 1. Ask (one message, in the user's language; accept partial answers)
1. Business name (Arabic + English) and what it does in one sentence.
2. Services (3–6) with a one-line promise each.
3. Cities / areas served (or "online only").
4. Phone, WhatsApp, email, address (or none), opening hours.
5. Brand colors (or "choose for me") and the feel: serious / friendly / luxury / playful.
6. Real numbers they're proud of (years, clients, rating, delivery time). Never invent any.
7. Optional: 2–3 things they wrote (posts, replies) for the voice files.

## 2. Apply
- `site.config.ts`: every field; pick the right schema.org `schemaType` (Dentist, LegalService, ProfessionalService, HomeAndConstructionBusiness, Restaurant, BeautySalon, LocalBusiness…).
  Only real stats in `business.stats`; remove the stats block items they didn't give.
- `lib/i18n.ts`: adapt the copy (steps, CTA, form labels) to the business type, both languages.
- `app/globals.css`: change the color tokens in `:root` only (keep contrast ≥ 4.5:1).
- `references/`: rewrite voice, humor, opinions for this business; put real numbers in `stats.md`; stories if given (run the `/voice` steps if samples were pasted).
- `data/keywords.csv` and `data/service-keywords.csv`: replace the example rows. With the Semrush connector, run `/keyword-research`;
  otherwise write realistic seed keywords for this niche **without volume/KD numbers** and tell the user to get real ones.
- Sample content: delete `content/blog/*/how-to-choose-a-service-company.md` and `content/services/*/consulting-riyadh.md`
  (and their images), then create one blog post with the `/blog` steps and one service page with the `/service` steps for this business.
- Remove any leftover placeholder text (`اسم نشاطك`, `Your Business`, `example.com`).

## 3. Verify & show
`npm run check-seo` (0 errors) → `npm run build` → tell the user to run `git pull` then `npm run dev` and open http://localhost:3000/ar/ .
Offer `/publish` to put it online.
