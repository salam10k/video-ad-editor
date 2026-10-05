---
name: new-project
description: Create a new SEO project profile for any website or store (any platform, any language) by asking a few questions, then run a first audit. Use when the user types /new-project, adds a new site/store/client, or names a site that has no folder in projects/.
argument-hint: "[site URL]"
---

# /new-project

1. Ask in one message (accept partial answers): site URL · platform (Shopify, WordPress, Salla, Zid, Wix, static/code, other) ·
   language(s) · target country · business type · 3–5 confirmed facts (product/service, prices, delivery, guarantees, real numbers) ·
   voice/tone · known competitors · where keywords/tasks already live (OpenSEO project, Notion page, Semrush, a CSV).
2. Look things up instead of asking where possible: OpenSEO `list_projects` / `get_project_context` for this domain, Notion search for the brand name.
3. Copy `projects/_template/` to `projects/<short-name>/` and fill `project.json`, `brand.md`, `keywords.csv`
   (import existing keyword data with real numbers; never invent volumes).
4. Publishing method: Shopify → Shopify connector; WordPress → REST API (WP_USER / WP_APP_PASSWORD in .env); static → git path; otherwise manual.
   If a connector is needed and missing, tell the user to connect it at https://claude.ai/customize/connectors and start a new session.
5. Offer `/audit` as the next step.
