#!/usr/bin/env node
// Publishing speed limit per project (Google notices sudden spikes):
// day 1–2: 1/day · 3–4: 2 · 5–7: 3 · 8–14: 4 · then 5/day max. Translations of the same piece count once.
// Usage: node scripts/cadence.mjs --project <name>
//        node scripts/cadence.mjs --project <name> --log "<url or slug>" --key <translationKey>
import fs from 'node:fs';
import path from 'node:path';
import { args, loadProject, today } from './lib.mjs';

const a = args();
const p = loadProject(a.project);
const file = path.join(p.dir, 'publish-log.json');
const log = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
if (a.log) {
  log.push({ date: today(), page: a.log, key: a.key ?? a.log });
  fs.writeFileSync(file, JSON.stringify(log, null, 2) + '\n');
  console.log(`Logged ${a.log}`);
  process.exit(0);
}
const first = log.map((e) => e.date).sort()[0] ?? today();
const day = Math.floor((Date.parse(today()) - Date.parse(first)) / 86400000) + 1;
const allowed = day <= 2 ? 1 : day <= 4 ? 2 : day <= 7 ? 3 : day <= 14 ? 4 : 5;
const done = new Set(log.filter((e) => e.date === today()).map((e) => e.key)).size;
console.log(JSON.stringify({ project: p.name, day, allowedToday: allowed, publishedToday: done, canPublish: done < allowed }, null, 2));
process.exit(done < allowed ? 0 : 1);
