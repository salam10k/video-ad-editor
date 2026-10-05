# On-page SEO checklist (80+ signals)

Apply to **every** blog post and service page, **without** losing the voice and humor.
Items marked ⚙ are checked automatically by `npm run check-seo`; the rest Claude checks by reading the page.

## Keyword & intent
1. ⚙ One primary keyword per page; not used as primary by any other page in the same language (no cannibalization).
2. The page matches the search intent (informational → blog post; commercial/transactional → service page).
3. ⚙ 3–8 cluster keywords (synonyms, long-tail variants, questions) in front matter `keywords`.
4. Cluster keywords appear naturally in H2s, body and image alt text.
5. No keyword stuffing: primary keyword density roughly 0.5–1.5%; never forced.
6. Use entities and related terms Google expects for the topic (parts, tools, places, prices).
7. Answer the main question in the first 2–3 sentences (featured-snippet friendly).

## Title & meta
8. ⚙ Meta title 30–65 characters.
9. ⚙ Primary keyword in the meta title, as close to the start as reads naturally.
10. Meta title promises a benefit or answer (number, timeframe, price, "fix or call").
11. ⚙ Meta description 120–160 characters.
12. ⚙ Primary keyword in the meta description.
13. Meta description ends with a reason to click.
14. Unique title and description site-wide.
15. ⚙ Canonical URL set (automatic in the template).
16. ⚙ hreflang ar/en/x-default (automatic via `translationKey`).
17. Open Graph + Twitter tags (automatic in the template).

## URL
18. ⚙ Slug: lowercase latin, dashes, short (3–6 words), contains the keyword idea.
19. No dates or stop-word noise in the slug.
20. Never change a published slug.

## Headings & structure
21. ⚙ Exactly one H1 (the `title`); no `#` in the body.
22. ⚙ Primary keyword in the H1.
23. ⚙ At least 3 H2s on blog posts (2 on service pages).
24. ⚙ At least one H2 contains the primary or a cluster keyword.
25. Logical hierarchy H2 → H3, no skipped levels.
26. H2s read like a table of contents; a skimmer understands the whole page from them.
27. Match or beat the H2 count and topics of the top 3 ranking pages (`npm run analyze-serp`).
28. Short paragraphs (1–3 sentences).
29. Numbered lists for steps, bullet lists for options.
30. A comparison table where the topic compares options or prices.
31. A short summary / bottom line at the end.
32. A callout/blockquote with the single most useful tip.

## Content quality
33. ⚙ Primary keyword in the first 100 words.
34. Hook in the first 50 words (joke, wink, relatable scene) — see `references/humor.md`.
35. ⚙ Word count ≥ the average of the top 3 results (`targetWords` in front matter).
36. Covers every subtopic the top 3 cover, plus at least one they miss.
37. Includes a real stat from `references/stats.md` when relevant.
38. Includes a real story from `references/stories.md` when relevant.
39. Includes an honest opinion from `references/opinions.md` when relevant.
40. Written in the owner's voice (`references/voice.md`).
41. No filler phrases (see banned list in CLAUDE.md).
42. Facts are correct and current; prices given as ranges, not fake precision.
43. Safety warnings where relevant (gas, electricity, water + power).
44. Shows experience: specific details only a practitioner would know (E-E-A-T).
45. Clear next step for the reader (DIY steps or call us).
46. Date published and updated shown (automatic); set `updated` when you refresh a page.
47. Readable on mobile: no walls of text, no huge tables without scroll.

## Links
48. ⚙ 3–5 internal links to related posts, service pages, the services index or home.
49. ⚙ No broken internal links.
50. Descriptive anchor text (not "click here"); vary anchors.
51. At least one link from the post to the most relevant service page (money page).
52. After publishing, add a link **to** the new page from 1–2 older related pages.
53. ⚙ 2–3 external links to authoritative sources (government, standards bodies, manufacturers, Wikipedia).
54. External links open in a new tab with `rel="noopener"` (automatic).
55. Never link to direct competitors.
56. ⚙ Internal links stay in the same language.

## Images
57. ⚙ A cover image on every page.
58. ⚙ At least 2 images on blog posts (or match the top 3 average).
59. ⚙ Every image has alt text.
60. Alt text describes the image and includes a cluster keyword where natural, in the page language.
61. Images stored locally in `public/images/`, named with the slug (`<slug>-1.jpg`).
62. Images are compressed (Pexels "landscape"/"large" sizes, never originals).
63. Image credit for Pexels photos (automatic via `cover.credit`).
64. Images placed near the text they illustrate.

## FAQ & rich results
65. ⚙ 4–8 FAQ items on blog posts, 3–6 on service pages.
66. FAQ questions come from real searches ("People also ask", Semrush Questions tab).
67. FAQ answers are 1–3 sentences, self-contained.
68. FAQPage, BlogPosting/Service, BreadcrumbList and LocalBusiness JSON-LD (automatic in templates).

## Local SEO (service pages)
69. Service + city in H1, title, description, slug and first paragraph.
70. Mentions neighborhoods/areas served in that city where true.
71. NAP (name, address, phone) identical to Google Business Profile (footer, from `site.config.ts`).
72. Click-to-call and WhatsApp buttons above the fold (automatic).
73. Lead form above the fold (automatic).
74. Unique content per city page — never just swap the city name.
75. Links to the same service in other cities and other services in the same city (automatic).
76. Don't create hundreds of near-identical service pages; only where search demand exists.

## Conversion
77. One clear call to action, repeated at the top, middle and bottom.
78. Trust signals near the CTA: stats, guarantee, reviews (real only).
79. Price transparency: "price before work".
80. Answer objections (cost, time, mess, guarantee).

## Bilingual
81. ⚙ Both `ar` and `en` versions exist with the same `translationKey`.
82. Each language targets its own real keyword (from the CSV `lang` column), not a translation of the other.
83. Arabic: Arabic punctuation, RTL-safe (no mixed-direction mess), Western digits.
84. Humor localized, not translated.

## Freshness
85. Review top pages every 3–6 months: update facts, add new FAQs, set `updated`.
