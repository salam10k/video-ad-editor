#!/usr/bin/env node
// "Steal the winning format": measures the top-ranking pages for a keyword and prints their average.
// Usage: node scripts/analyze-serp.mjs <url1> <url2> <url3>
//    or: node scripts/analyze-serp.mjs --html page1.html page2.html   (saved pages, if fetching is blocked)
// Skip Reddit, Quora, YouTube, forums and giant directories when choosing URLs — pick real articles.
import fs from 'node:fs';
import { args } from './lib.mjs';

const a = args();
const sources = a._;
if (!sources.length) {
  console.error('Usage: node scripts/analyze-serp.mjs <url1> <url2> <url3>');
  process.exit(1);
}

const strip = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

function analyze(html, url) {
  html = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/gi, ' ');
  const main =
    html.match(/<article[\s\S]*?<\/article>/i)?.[0] ??
    html.match(/<main[\s\S]*?<\/main>/i)?.[0] ??
    html.replace(/<(header|nav|footer|aside)[\s\S]*?<\/\1>/gi, ' ');
  const text = strip(main);
  const heads = (tag) => [...main.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))].map((m) => strip(m[1]));
  const host = (() => { try { return new URL(url).host; } catch { return ''; } })();
  const links = [...main.matchAll(/<a\s[^>]*href="([^"#]+)"/gi)].map((m) => m[1]);
  return {
    url,
    title: strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ''),
    description: html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1] ?? '',
    words: text.split(/\s+/).filter(Boolean).length,
    h1: heads('h1'),
    h2: heads('h2'),
    h3: heads('h3').length,
    images: (main.match(/<img\s/gi) ?? []).length,
    lists: (main.match(/<(ul|ol)[\s>]/gi) ?? []).length,
    tables: (main.match(/<table[\s>]/gi) ?? []).length,
    faq: /FAQPage/.test(html) || heads('h2').some((h) => /faq|question|أسئلة/i.test(h)),
    internalLinks: links.filter((l) => l.startsWith('/') || (host && l.includes(host))).length,
    externalLinks: links.filter((l) => /^https?:/.test(l) && !(host && l.includes(host))).length,
  };
}

const results = [];
for (const s of sources) {
  try {
    const html = a.html
      ? fs.readFileSync(s, 'utf8')
      : await (await fetch(s, { headers: { 'User-Agent': 'Mozilla/5.0 (SEO research)' } })).text();
    results.push(analyze(html, s));
  } catch (e) {
    console.error(`Could not read ${s}: ${e.message}`);
  }
}
if (!results.length) process.exit(1);

for (const r of results) {
  console.log(`\n■ ${r.url}\n  title: ${r.title}\n  meta: ${r.description}`);
  console.log(`  ${r.words} words · ${r.h2.length} H2 · ${r.h3} H3 · ${r.images} images · ${r.lists} lists · ${r.tables} tables · FAQ: ${r.faq ? 'yes' : 'no'} · links ${r.internalLinks} int / ${r.externalLinks} ext`);
  console.log(`  H2s: ${r.h2.slice(0, 15).join(' | ')}`);
}
const avg = (k) => Math.round(results.reduce((s, r) => s + (Array.isArray(r[k]) ? r[k].length : r[k]), 0) / results.length);
console.log('\n=== WINNING FORMULA (average of the pages above) ===');
console.log(JSON.stringify({
  targetWords: avg('words'),
  h2: avg('h2'),
  h3: avg('h3'),
  images: Math.max(2, avg('images')),
  lists: avg('lists'),
  tables: avg('tables'),
  faq: results.filter((r) => r.faq).length >= Math.ceil(results.length / 2),
}, null, 2));
console.log('\nCover every topic the H2s above share, then add what they all miss (your stories, stats, opinions).');
