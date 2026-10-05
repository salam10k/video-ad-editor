#!/usr/bin/env node
// "Check": runs the automatable part of the on-page checklist on ONE page, in any language.
//   Draft:    node scripts/check-page.mjs projects/<name>/content/<file>.md
//   Live URL: node scripts/check-page.mjs https://example.com/page --keyword "main keyword"
// Exit code 1 when any ERROR is found.
import fs from 'node:fs';
import matter from 'gray-matter';
import { args, containsKeyword, norm, stripTags, wordsOf } from './lib.mjs';

const a = args();
const target = a._[0];
if (!target) {
  console.error('Usage: check-page.mjs <draft.md | https://url> [--keyword "..."] [--kind blog|page|product]');
  process.exit(1);
}

let page;
if (/^https?:\/\//.test(target)) {
  const res = await fetch(target, { headers: { 'User-Agent': 'Mozilla/5.0 (SEO-Agent)' } });
  const html = await res.text();
  const meta = (k) => html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${k}["'][^>]*content=["']([^"']*)`, 'i'))?.[1] ?? '';
  const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? html.match(/<article\b[\s\S]*?<\/article>/i)?.[0] ?? html;
  const origin = new URL(target).origin;
  const links = [...main.matchAll(/<a\b[^>]*href=["']([^"'#]+)["']/gi)].map((m) => m[1]);
  page = {
    source: target,
    kind: a.kind ?? 'page',
    keyword: a.keyword ?? '',
    cluster: [],
    title: stripTags(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? ''),
    metaTitle: stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ''),
    description: meta('description'),
    h1Count: (main.match(/<h1\b/gi) ?? []).length,
    h2: [...main.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => stripTags(m[1])),
    text: stripTags(main.replace(/<h1\b[\s\S]*?<\/h1>/i, '')),
    internal: links.filter((l) => l.startsWith('/') || l.startsWith(origin)),
    external: links.filter((l) => /^https?:/.test(l) && !l.startsWith(origin)),
    images: [...main.matchAll(/<img\b[^>]*>/gi)].map((m) => ({ alt: m[0].match(/alt=["']([^"']*)/i)?.[1] ?? '' })),
    faq: (html.match(/FAQPage/g) ?? []).length ? 4 : 0,
    slug: new URL(target).pathname,
    targetWords: Number(a['target-words'] ?? 0),
  };
} else {
  const { data: d, content } = matter(fs.readFileSync(target, 'utf8'));
  const body = content
    .replace(/```[\s\S]*?```/g, ' ');
  const links = [...body.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)[^)]*\)/g)].map((m) => m[1]);
  page = {
    source: target,
    kind: d.kind ?? a.kind ?? 'blog',
    keyword: d.primaryKeyword ?? a.keyword ?? '',
    cluster: d.keywords ?? [],
    title: d.title ?? '',
    metaTitle: d.metaTitle ?? d.title ?? '',
    description: d.description ?? '',
    h1Count: (body.match(/^#\s/gm) ?? []).length + (d.title ? 1 : 0),
    h2: [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1]),
    text: body.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#>*_`|-]/g, ' '),
    internal: links.filter((l) => l.startsWith('/') || (d.siteUrl && l.startsWith(d.siteUrl))),
    external: links.filter((l) => /^https?:/.test(l) && !(d.siteUrl && l.startsWith(d.siteUrl))),
    images: [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)].map((m) => ({ alt: m[1] })).concat(d.cover ? [{ alt: d.cover.alt ?? '' }] : []),
    faq: (d.faq ?? []).length,
    slug: d.slug ?? '',
    targetWords: Number(d.targetWords ?? 0),
    todos: (content.match(/⚠️\s*PRÜFEN|⚠️\s*CHECK|TODO|⚠️\s*تحقق/g) ?? []).length,
  };
}

const isBlog = page.kind === 'blog';
const out = [];
const err = (m) => out.push(['ERROR', m]);
const warn = (m) => out.push(['WARN ', m]);
const kw = page.keyword;
const words = wordsOf(page.text);

if (!kw) err('no primary keyword (front matter primaryKeyword or --keyword)');
// Title / meta
if (!page.metaTitle) err('missing meta title');
else if (page.metaTitle.length < 30 || page.metaTitle.length > 65) warn(`meta title ${page.metaTitle.length} chars (aim 30–60)`);
if (kw && page.metaTitle && !containsKeyword(page.metaTitle, kw)) err('primary keyword not in meta title');
if (kw && page.title && !containsKeyword(page.title, kw)) err('primary keyword not in H1');
if (!page.description) err('missing meta description');
else if (page.description.length < 70 || page.description.length > 200) err(`meta description ${page.description.length} chars (must be 70–200, aim 110–160)`);
else if (page.description.length < 110 || page.description.length > 165) warn(`meta description ${page.description.length} chars (aim 110–160)`);
if (kw && page.description && !containsKeyword(page.description, kw)) warn('primary keyword not in meta description');
// Headings
if (page.h1Count !== 1) err(`${page.h1Count} H1 headings (need exactly 1)`);
if (page.h2.length < (isBlog ? 3 : 2)) warn(`only ${page.h2.length} H2 headings`);
const cluster = [kw, ...page.cluster].filter(Boolean);
if (page.h2.length && cluster.length && !page.h2.some((h) => cluster.some((k) => containsKeyword(h, k) || norm(h).includes(norm(k).split(' ')[0]))))
  warn('no H2 contains the primary keyword or a cluster keyword');
// Content
if (kw && !containsKeyword(words.slice(0, 100).join(' '), kw)) {
  // Accept the cluster form of the keyword in the intro as a warning only (inflected languages like German/Arabic).
  const close = cluster.slice(1).some((k) => containsKeyword(words.slice(0, 100).join(' '), k));
  (close ? warn : err)('primary keyword not in the first 100 words');
}
const minWords = page.targetWords ? Math.round(page.targetWords * 0.85) : isBlog ? 600 : 250;
if (words.length < minWords) warn(`${words.length} words (target ${minWords}+)`);
if (isBlog && page.cluster.length < 3) warn(`keyword cluster has ${page.cluster.length} keywords (aim 3–8)`);
// Links
if (page.internal.length < (isBlog ? 3 : 1)) err(`${page.internal.length} internal links (need ${isBlog ? '3–5' : '1+'})`);
if (isBlog && page.external.length < 1) err('no external links to authoritative sources (aim 2–3)');
else if (isBlog && page.external.length > 4) warn(`${page.external.length} external links (aim 2–3)`);
// Images
if (!page.images.length) warn('no images');
for (const i of page.images) if (!i.alt.trim()) err('image without alt text');
// FAQ
if (isBlog && page.faq < 4) warn(`${page.faq} FAQ items (aim 4–8)`);
// Slug
if (page.slug && /[A-Z\s_]|[^\x00-\x7F]/.test(page.slug.replace(/^\/+/, ''))) warn(`URL "${page.slug}" should be lowercase latin with dashes (umlauts → ae/oe/ue)`);
// Unfinished parts
if (page.todos) err(`${page.todos} unfinished placeholder(s) (⚠️ PRÜFEN / TODO) — fill in before publishing`);

const errors = out.filter((o) => o[0] === 'ERROR').length;
console.log(`${errors ? '✗' : '✓'} ${page.source}`);
console.log(`  keyword "${kw}" · ${words.length} words · ${page.h2.length} H2 · ${page.internal.length} internal / ${page.external.length} external links · ${page.images.length} images · ${page.faq} FAQ`);
for (const [l, m] of out) console.log(`  ${l} ${m}`);
console.log(`\n${errors} errors, ${out.length - errors} warnings`);
process.exit(errors ? 1 : 0);
