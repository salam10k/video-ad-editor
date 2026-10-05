#!/usr/bin/env node
// Picks the next keyword(s) to write about, skipping ones already used.
//
// Blog posts (informational, easy, with demand):
//   node scripts/next-keyword.mjs                       -> data/keywords.csv
// Service pages (money keywords, sorted by CPC):
//   node scripts/next-keyword.mjs --type service        -> data/service-keywords.csv
// Options: --file <csv> --lang ar|en --max-kd 30 --min-volume 100 --limit 10 --json
//
// Works with a Semrush export (Keyword, Intent, Volume, Keyword Difficulty, CPC (USD))
// or a hand-made CSV with: keyword,volume,kd,intent,cpc,lang
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, args, col, norm, num, parseCsv, readContent, readLog } from './lib.mjs';

const a = args();
const type = a.type === 'service' ? 'service' : 'blog';
const file = path.resolve(ROOT, a.file ?? (type === 'service' ? 'data/service-keywords.csv' : 'data/keywords.csv'));
const maxKd = num(a['max-kd'] ?? 30);
const minVol = num(a['min-volume'] ?? (type === 'service' ? 10 : 100));
const limit = num(a.limit ?? 10);

if (!fs.existsSync(file)) {
  console.error(`No keyword file at ${path.relative(ROOT, file)}. Run the /keyword-research skill or export a CSV from Semrush.`);
  process.exit(1);
}

const used = new Set([
  ...readContent().flatMap((i) => [i.data.primaryKeyword, ...(i.data.keywords ?? [])]).map(norm),
  ...readLog().map((l) => norm(l.keyword)),
]);

const rows = parseCsv(fs.readFileSync(file, 'utf8')).map((r) => ({
  keyword: col(r, 'Keyword', 'keyword', 'الكلمة'),
  volume: num(col(r, 'Volume', 'Search Volume', 'volume')),
  kd: num(col(r, 'Keyword Difficulty', 'KD', 'kd', 'Difficulty')),
  intent: (col(r, 'Intent', 'intent', 'Intents') ?? '').toLowerCase(),
  cpc: num(col(r, 'CPC (USD)', 'CPC', 'cpc')),
  lang: (col(r, 'lang', 'language') ?? '').toLowerCase(),
}));

const picked = rows
  .filter((r) => r.keyword && !used.has(norm(r.keyword)))
  .filter((r) => !a.lang || !r.lang || r.lang === a.lang)
  .filter((r) => Number.isNaN(r.kd) || r.kd <= maxKd)
  .filter((r) => Number.isNaN(r.volume) || r.volume >= minVol)
  .filter((r) => {
    if (!r.intent) return true;
    return type === 'blog'
      ? /inform|^i$|i,|معلومات/.test(r.intent)
      : /commerc|transact|^c$|^t$|c,|t,|تجاري/.test(r.intent);
  })
  .sort((x, y) =>
    type === 'service'
      ? (y.cpc || 0) - (x.cpc || 0) || (y.volume || 0) - (x.volume || 0)
      : (y.volume || 0) - (x.volume || 0) || (x.kd || 0) - (y.kd || 0),
  )
  .slice(0, limit);

if (a.json) {
  console.log(JSON.stringify(picked, null, 2));
} else if (!picked.length) {
  console.log('No unused keywords match the filters. Add more with /keyword-research or loosen --max-kd / --min-volume.');
} else {
  console.log(`Next ${type} keywords (KD ≤ ${maxKd}, volume ≥ ${minVol}, unused) from ${path.relative(ROOT, file)}:\n`);
  for (const r of picked)
    console.log(`  ${r.keyword}  —  vol ${r.volume || '?'} · KD ${Number.isNaN(r.kd) ? '?' : r.kd} · CPC ${Number.isNaN(r.cpc) ? '?' : r.cpc}${r.lang ? ' · ' + r.lang : ''}`);
}
