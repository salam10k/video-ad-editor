#!/usr/bin/env node
// Downloads royalty-free photos from Pexels into public/images/ and prints ready-to-paste front matter.
// Usage: node scripts/pexels.mjs "<english search query>" <slug> [count=2]
// Needs PEXELS_API_KEY in .env (free: https://www.pexels.com/api/).
// Images are saved locally (not hot-linked) so pages stay fast and never break.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, args, loadEnv } from './lib.mjs';

loadEnv();
const a = args();
const [query, slug, countArg] = a._;
const count = Math.min(Number(countArg ?? 2), 10);
const key = process.env.PEXELS_API_KEY;

if (!query || !slug) {
  console.error('Usage: node scripts/pexels.mjs "<query>" <slug> [count]');
  process.exit(1);
}
if (!key) {
  console.error('PEXELS_API_KEY is missing. Copy .env.example to .env and paste your key from https://www.pexels.com/api/');
  process.exit(1);
}

const res = await fetch(
  `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
  { headers: { Authorization: key } },
);
if (!res.ok) {
  console.error(`Pexels API error ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const { photos = [] } = await res.json();
if (!photos.length) {
  console.error('No photos found — try a simpler English query.');
  process.exit(1);
}

const dir = path.join(ROOT, 'public', 'images');
fs.mkdirSync(dir, { recursive: true });
const saved = [];
for (const [i, p] of photos.entries()) {
  // "landscape" = 1200x627 crop, "large" = 940px wide: small files, sharp enough.
  const src = i === 0 ? p.src.landscape : p.src.large;
  const name = `${slug}-${i + 1}.jpg`;
  const img = await fetch(src);
  fs.writeFileSync(path.join(dir, name), Buffer.from(await img.arrayBuffer()));
  saved.push({ src: `/images/${name}`, alt: p.alt || query, credit: p.photographer, creditUrl: p.url });
}

console.log(JSON.stringify(saved, null, 2));
console.error(`\nSaved ${saved.length} image(s). Use the first as "cover" and the rest inline:  ![alt](/images/${slug}-2.jpg)`);
console.error('Rewrite each alt text in the page language and include a cluster keyword where it is natural.');
