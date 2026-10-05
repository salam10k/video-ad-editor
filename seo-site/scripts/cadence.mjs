#!/usr/bin/env node
// Publishing speed limit. Google notices sudden spikes, so ramp up slowly:
// day 1–2: 1/day · day 3–4: 2/day · day 5–7: 3/day · day 8–14: 4/day · after: 5/day (hard cap).
// A page and its translation (same translationKey) count as ONE piece.
// Usage: node scripts/cadence.mjs            -> prints status, exit 1 if today's quota is used up
//        node scripts/cadence.mjs --log blog ar my-slug "keyword" translationKey   -> records a publish
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, args, readLog } from './lib.mjs';

const a = args();
const logFile = path.join(ROOT, 'data', 'publish-log.json');
const log = readLog();
const today = new Date().toISOString().slice(0, 10);

if (a.log) {
  const [type, lang, slug, keyword, translationKey] = [a.log, ...a._];
  log.push({ date: today, type, lang, slug, keyword, translationKey: translationKey ?? slug });
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2) + '\n');
  console.log(`Logged ${type}/${lang}/${slug}`);
  process.exit(0);
}

const pieces = (entries) => new Set(entries.map((e) => e.translationKey ?? e.slug)).size;
const first = log.map((e) => e.date).sort()[0] ?? today;
const day = Math.floor((Date.parse(today) - Date.parse(first)) / 86400000) + 1;
const allowed = day <= 2 ? 1 : day <= 4 ? 2 : day <= 7 ? 3 : day <= 14 ? 4 : 5;
const done = pieces(log.filter((e) => e.date === today));
const status = { day, allowedToday: allowed, publishedToday: done, canPublish: done < allowed };
console.log(JSON.stringify(status, null, 2));
if (!status.canPublish) {
  console.log('\nQuota reached for today. Save the next piece as draft: true and publish tomorrow.');
  process.exit(1);
}
