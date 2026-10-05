---
name: build-site
description: Video step 1 — build a brand-new SEO website for a project that has no site yet (homepage, blog index, services/products index), static site generation, any language(s), design cloned from a reference screenshot. Use when the user types /build-site, or a project's platform is "none"/"new", or the user asks to build a website.
argument-hint: "[project] [attach a design screenshot]"
---

# /build-site — the video's website, for any project

The project must exist (`/new-project`). If it already has a live site/store, do NOT build a second one (it splits Google's trust) — say so and use `/audit` instead.

1. Copy the template: `cp -r ../seo-site projects/<p>/site` (without `node_modules`, `.next`, `out`).
2. In `projects/<p>/site`, follow its `/setup` skill using the answers already in `projects/<p>/project.json` and `brand.md`:
   business name, services/products, cities or markets, contact, languages.
   - Languages: the template ships `ar` + `en`. For other languages, add them to `languages` in `site.config.ts`, add a dictionary in `lib/i18n.ts`
     (and `dir`: `rtl` only for ar/fa/he/ur), and create `content/blog/<lang>/` + `content/services/<lang>/`.
3. **Design (like the video):** if the user attached a screenshot (e.g. from Dribbble: search "<niche> website"), restyle `app/globals.css` tokens and
   components to match it — never change metadata, routes or the static export. Without a screenshot, pick colors from `brand.md`.
4. Rules from the video: static site generation only (`output: 'export'`), sitemap.xml, robots.txt, canonical + hreflang, JSON-LD — already built in.
5. `npm install && npm run build && npm run lighthouse` → must be 100/100/100/100; fix anything below.
6. Set `project.json` → `platform: "static"`, `publish.method: "git"`, `siteDir: "site"`. Offer `/keywords`, then `/blog`, then `/publish`.
