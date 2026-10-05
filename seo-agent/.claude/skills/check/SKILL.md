---
name: check
description: Check one page or draft (any language) against the 85-point on-page SEO checklist and the brand rules, then fix what fails. Use when the user types /check, pastes a URL or draft to review, or asks if a page is SEO-ready.
argument-hint: "<url or draft file> [keyword]"
---

# /check

1. Run `npm run check -- <draft.md | url> [--keyword "..."]` for the automatable checks.
2. Read the page against `../seo-site/seo/on-page-checklist.md` for the rest (intent match, hook in first 50 words, real facts, readability, CTA).
3. Check `brand.md`: forbidden claims, unconfirmed specs, voice/form of address.
4. Fix the draft directly (or list exact changes for a live page, then apply with `/fix`). Re-run step 1 until 0 errors.
5. Report: errors fixed, warnings left on purpose (and why), placeholders the user must fill.
