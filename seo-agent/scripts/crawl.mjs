#!/usr/bin/env node
// Step 1 of "analyze": crawl a live website and record the SEO facts of every page.
// Usage: node scripts/crawl.mjs --project <name> [--max 200] [--url https://override]
// Output: projects/<name>/reports/crawl-YYYY-MM-DD.json
// Works on any platform (Shopify, WordPress, Salla, Zid, Wix, static sites...) because it reads public HTML.
import fs from 'node:fs';
import path from 'node:path';
import { args, loadProject, stripTags, today, wordsOf } from './lib.mjs';

const a = args();
const project = loadProject(a.project);
const base = new URL(a.url ?? project.url);
const origin = base.origin;
const MAX = Number(a.max ?? 200);
const UA = 'Mozilla/5.0 (compatible; SEO-Agent/1.0; +https://claude.com/claude-code)';

async function get(url, opts = {}) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000), ...opts });
    const body = opts.method === 'HEAD' ? '' : await res.text();
    return { status: res.status, finalUrl: res.url, body, ms: Date.now() - t0, headers: Object.fromEntries(res.headers) };
  } catch (e) {
    return { status: 0, finalUrl: url, body: '', ms: Date.now() - t0, error: e.message, headers: {} };
  }
}

const attr = (tag, name) => tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1];
const metaContent = (html, key) => {
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = m[0];
    if ((attr(tag, 'name') ?? attr(tag, 'property') ?? '').toLowerCase() === key) return attr(tag, 'content') ?? '';
  }
  return undefined;
};

function analyze(url, res) {
  const html = res.body;
  const headings = (lvl) => [...html.matchAll(new RegExp(`<h${lvl}\\b[^>]*>([\\s\\S]*?)</h${lvl}>`, 'gi'))].map((m) => stripTags(m[1]));
  const main =
    html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ??
    html.match(/<article\b[\s\S]*?<\/article>/i)?.[0] ??
    html.replace(/<(header|nav|footer|aside)\b[\s\S]*?<\/\1>/gi, ' ');
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const links = [...html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"'#]+)["'][^>]*>/gi)].map((m) => m[1]);
  const abs = links
    .map((l) => { try { return new URL(l, url).href.split('#')[0]; } catch { return null; } })
    .filter(Boolean);
  const internal = [...new Set(abs.filter((l) => l.startsWith(origin)))];
  const external = [...new Set(abs.filter((l) => /^https?:/.test(l) && !l.startsWith(origin)))];
  const ldTypes = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].flatMap((m) => {
    try {
      const j = JSON.parse(m[1]);
      const items = Array.isArray(j) ? j : j['@graph'] ?? [j];
      return items.map((x) => x['@type']).flat().filter(Boolean);
    } catch { return ['INVALID_JSON_LD']; }
  });
  const canonicalTag = html.match(/<link\b[^>]*rel\s*=\s*["']canonical["'][^>]*>/i)?.[0];
  const hreflang = [...html.matchAll(/<link\b[^>]*hreflang\s*=\s*["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
  const robotsMeta = metaContent(html, 'robots') ?? '';
  return {
    url,
    finalUrl: res.finalUrl,
    status: res.status,
    ms: res.ms,
    bytes: html.length,
    lang: html.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)["']/i)?.[1] ?? '',
    title: stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ''),
    description: metaContent(html, 'description') ?? '',
    canonical: canonicalTag ? attr(canonicalTag, 'href') : '',
    robots: robotsMeta,
    xRobots: res.headers['x-robots-tag'] ?? '',
    hreflang,
    ogTitle: metaContent(html, 'og:title') ?? '',
    ogImage: metaContent(html, 'og:image') ?? '',
    h1: headings(1),
    h2: headings(2),
    h3count: headings(3).length,
    words: wordsOf(stripTags(main)).length,
    images: imgs.length,
    imagesNoAlt: imgs.filter((t) => !/\balt\s*=\s*["'][^"']+["']/i.test(t)).map((t) => attr(t, 'src') ?? '?').slice(0, 20),
    internalLinks: internal,
    externalLinks: external.length,
    structuredData: [...new Set(ldTypes)],
    passwordProtected: /\/password\/?$/.test(new URL(res.finalUrl).pathname) || /Enter using password|Opening soon/i.test(html.slice(0, 20000)) && /shopify/i.test(html),
  };
}

async function sitemapUrls(url, seen = new Set(), depth = 0) {
  if (seen.has(url) || depth > 3) return [];
  seen.add(url);
  const res = await get(url);
  if (res.status !== 200) return [];
  const locs = [...res.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1].replace(/&amp;/g, '&'));
  if (/<sitemapindex/i.test(res.body)) {
    const nested = [];
    for (const l of locs) nested.push(...(await sitemapUrls(l, seen, depth + 1)));
    return nested;
  }
  return locs;
}

console.error(`Crawling ${origin} (max ${MAX} pages)…`);
const robots = await get(`${origin}/robots.txt`);
const sitemapFromRobots = [...robots.body.matchAll(/^sitemap:\s*(\S+)/gim)].map((m) => m[1]);
const sitemapList = sitemapFromRobots.length ? sitemapFromRobots : [`${origin}/sitemap.xml`];
let fromSitemap = [];
for (const s of sitemapList) fromSitemap.push(...(await sitemapUrls(s)));
const sitemapRawCount = fromSitemap.length;
const sitemapForeign = [...new Set(fromSitemap.filter((u) => !u.startsWith(origin)))].slice(0, 20);
fromSitemap = [...new Set(fromSitemap.filter((u) => u.startsWith(origin)))];

const queue = [base.href, ...fromSitemap];
const seen = new Set();
const pages = [];
while (queue.length && pages.length < MAX) {
  const batch = [];
  while (queue.length && batch.length < 4) {
    const u = queue.shift();
    if (seen.has(u)) continue;
    seen.add(u);
    batch.push(u);
  }
  const results = await Promise.all(batch.map(async (u) => analyze(u, await get(u))));
  for (const p of results) {
    pages.push(p);
    // Follow internal links too, to find pages missing from the sitemap (skip files and cart/account URLs).
    for (const l of p.internalLinks)
      if (!seen.has(l) && !/\.(jpg|jpeg|png|gif|webp|svg|pdf|zip|css|js)(\?|$)/i.test(l) && !/\/(cart|account|checkout|search)(\/|\?|$)/.test(l))
        queue.push(l);
  }
  process.stderr.write(`\r  ${pages.length} pages`);
}
console.error('');

// Check status of internal links that were not crawled (broken link detection, HEAD only).
const allLinks = new Set(pages.flatMap((p) => p.internalLinks));
const statusOf = Object.fromEntries(pages.map((p) => [p.url, p.status]));
const unchecked = [...allLinks].filter((l) => !(l in statusOf)).slice(0, 150);
for (let i = 0; i < unchecked.length; i += 6) {
  const res = await Promise.all(unchecked.slice(i, i + 6).map(async (l) => [l, (await get(l, { method: 'HEAD' })).status]));
  for (const [l, s] of res) statusOf[l] = s;
}

const report = {
  project: a.project,
  origin,
  date: today(),
  robotsTxt: { status: robots.status, body: robots.body.slice(0, 3000) },
  sitemaps: sitemapList,
  sitemapUrlCount: fromSitemap.length,
  sitemapRawCount,
  sitemapForeign,
  linkStatus: statusOf,
  pages,
};
const out = path.join(project.reportsDir, `crawl-${today()}.json`);
fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log(`Crawled ${pages.length} pages → ${path.relative(process.cwd(), out)}`);
