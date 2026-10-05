#!/usr/bin/env node
// On-page SEO checker: runs the automatable part of seo/on-page-checklist.md on every page in content/.
// Usage: node scripts/check-seo.mjs [content/blog/ar/my-post.md ...]   (no args = check everything)
// Exit code 1 when any ERROR is found. WARNs are advice.
import { LANGS, ROOT, args, containsKeyword, norm, readContent } from './lib.mjs';
import path from 'node:path';

const a = args();
const only = a._.map((f) => path.relative(ROOT, path.resolve(f)));
const all = readContent();
const items = only.length ? all.filter((i) => only.includes(i.file)) : all;

// Every URL that exists on the site, for broken internal link detection.
const urls = new Set();
for (const l of LANGS) for (const s of ['', 'blog/', 'services/']) urls.add(`/${l}/${s}`);
for (const i of all) urls.add(`/${i.lang}/${i.kind}/${i.slug}/`);

let errors = 0;
let warns = 0;

const stripMd = (md) =>
  md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|-]/g, ' ');

for (const item of items) {
  const { data: d, body, kind, lang, slug } = item;
  const isBlog = kind === 'blog';
  const out = [];
  const err = (m) => out.push(['ERROR', m]);
  const warn = (m) => out.push(['WARN ', m]);

  // --- Front matter -------------------------------------------------------
  for (const f of ['title', 'description', 'translationKey', 'primaryKeyword', 'date']) if (!d[f]) err(`missing front matter "${f}"`);
  if (!isBlog) for (const f of ['service', 'city']) if (!d[f]) err(`missing front matter "${f}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) err(`slug "${slug}" must be lowercase latin letters, digits and dashes`);

  const kw = d.primaryKeyword ?? '';
  const metaTitle = d.metaTitle ?? d.title ?? '';
  const desc = d.description ?? '';

  // --- Title & description -------------------------------------------------
  if (metaTitle.length < 30 || metaTitle.length > 65) warn(`meta title is ${metaTitle.length} chars (aim 30–65)`);
  if (kw && !containsKeyword(metaTitle, kw)) err('primary keyword not in meta title');
  if (kw && !containsKeyword(d.title ?? '', kw)) err('primary keyword not in H1 (title)');
  if (desc.length < 70 || desc.length > 200) err(`meta description is ${desc.length} chars (must be 70–200, aim 120–160)`);
  else if (desc.length < 110 || desc.length > 165) warn(`meta description is ${desc.length} chars (aim 120–160)`);
  if (kw && !containsKeyword(desc, kw)) warn('primary keyword not in meta description');

  // --- Headings ------------------------------------------------------------
  if (/^#\s/m.test(body)) err('body contains an H1 ("# "). The page H1 comes from "title" — use ## and ###');
  const h2s = [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1]);
  const minH2 = isBlog ? 3 : 2;
  if (h2s.length < minH2) warn(`only ${h2s.length} H2 headings (aim ${minH2}+)`);
  const cluster = [kw, ...(d.keywords ?? [])].filter(Boolean);
  if (h2s.length && !h2s.some((h) => cluster.some((k) => containsKeyword(h, k) || norm(h).includes(norm(k).split(' ')[0]))))
    warn('no H2 contains the primary keyword or a cluster keyword');
  if (/^####\s/m.test(body) && !/^###\s/m.test(body)) warn('H4 used without H3 (heading levels skipped)');

  // --- Keyword placement ---------------------------------------------------
  const plain = stripMd(body);
  const words = plain.split(/\s+/).filter(Boolean);
  const first100 = words.slice(0, 100).join(' ');
  if (kw && !containsKeyword(first100, kw)) err('primary keyword not in the first 100 words');
  if ((d.keywords ?? []).length < 3) warn(`keyword cluster has ${(d.keywords ?? []).length} keywords (aim 3–8)`);
  const minWords = d.targetWords ? Math.round(d.targetWords * 0.9) : isBlog ? 600 : 300;
  if (words.length < minWords) warn(`${words.length} words (target ${minWords}+${d.targetWords ? ', from SERP analysis' : ''})`);

  // --- Links ---------------------------------------------------------------
  const links = [...body.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)[^)]*\)/g)].map((m) => m[1]);
  const internal = links.filter((h) => h.startsWith('/'));
  const external = links.filter((h) => /^https?:\/\//.test(h));
  const [inMin, inMax] = isBlog ? [3, 8] : [2, 10];
  if (internal.length < inMin) err(`${internal.length} internal links (need ${inMin}+, aim 3–5)`);
  else if (internal.length > inMax) warn(`${internal.length} internal links (aim 3–5)`);
  if (isBlog && external.length < 1) err('no external links (aim 2–3 to authoritative sources)');
  else if (isBlog && (external.length < 2 || external.length > 4)) warn(`${external.length} external links (aim 2–3)`);
  for (const h of internal) {
    const clean = h.split('#')[0];
    const withSlash = clean.endsWith('/') ? clean : `${clean}/`;
    if (!urls.has(withSlash) && !clean.startsWith('/images/')) err(`broken internal link ${h}`);
    if (!clean.startsWith(`/${lang}/`) && !clean.startsWith('/images/')) warn(`internal link ${h} points to another language`);
  }

  // --- Images --------------------------------------------------------------
  const imgs = [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
  for (const m of imgs) if (!m[1].trim()) err(`image without alt text: ${m[2]}`);
  if (!d.cover) warn('no cover image (run: npm run pexels -- "<query>" <slug>)');
  else if (!d.cover.alt) err('cover image has no alt text');
  if (isBlog && imgs.length + (d.cover ? 1 : 0) < 2) warn(`${imgs.length + (d.cover ? 1 : 0)} images (aim 2+ — match the top-ranking pages)`);

  // --- FAQ -----------------------------------------------------------------
  const faq = d.faq ?? [];
  if (isBlog && faq.length < 4) err(`${faq.length} FAQ items (need 4–8)`);
  else if (!isBlog && faq.length < 3) warn(`${faq.length} FAQ items (aim 3–6)`);
  if (faq.length > 8) warn(`${faq.length} FAQ items (aim 4–8)`);

  // --- Uniqueness / cannibalization ---------------------------------------
  const twins = all.filter((o) => o !== item && o.lang === lang && norm(o.data.primaryKeyword) === norm(kw));
  if (kw && twins.length) err(`primary keyword also used by ${twins.map((t) => t.file).join(', ')} (keyword cannibalization)`);
  const dupTitle = all.filter((o) => o !== item && o.lang === lang && o.data.title === d.title);
  if (dupTitle.length) err(`duplicate title with ${dupTitle.map((t) => t.file).join(', ')}`);

  // --- Translation pair ----------------------------------------------------
  for (const other of LANGS.filter((l) => l !== lang)) {
    if (!all.some((o) => o.kind === kind && o.lang === other && o.data.translationKey === d.translationKey))
      warn(`no ${other} version with translationKey "${d.translationKey}"`);
  }

  // --- Report --------------------------------------------------------------
  const e = out.filter((o) => o[0] === 'ERROR').length;
  errors += e;
  warns += out.length - e;
  console.log(`${e ? '✗' : '✓'} ${item.file}  (${words.length} words, ${internal.length} internal / ${external.length} external links, ${faq.length} FAQ)`);
  for (const [lvl, msg] of out) console.log(`    ${lvl} ${msg}`);
}

console.log(`\n${items.length} pages checked — ${errors} errors, ${warns} warnings`);
process.exit(errors ? 1 : 0);
