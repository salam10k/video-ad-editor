#!/usr/bin/env node
// Google Lighthouse on live pages: 4 scores + every failing audit, so the agent can fix them.
// Usage: node scripts/lighthouse.mjs --project <name> [--pages 5] [--desktop]
//    or: node scripts/lighthouse.mjs https://example.com/ https://example.com/page
// Needs Chrome/Chromium on this computer (set CHROME_PATH if it is not found).
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { args, loadProject, today } from './lib.mjs';

const a = args();
let urls = a._;
let outDir = path.resolve('lighthouse-reports');
if (a.project) {
  const p = loadProject(a.project);
  outDir = path.join(p.reportsDir, 'lighthouse');
  if (!urls.length) {
    const crawl = fs.readdirSync(p.reportsDir).filter((f) => f.startsWith('crawl-')).sort().pop();
    const pages = crawl ? JSON.parse(fs.readFileSync(path.join(p.reportsDir, crawl), 'utf8')).pages.filter((x) => x.status === 200) : [];
    // Home + one page of each type (product, collection, blog, other) — templates matter more than individual pages.
    const pick = (re) => pages.find((x) => re.test(new URL(x.url).pathname))?.url;
    urls = [p.url, pick(/\/products?\//), pick(/\/collections?\/|\/category\//), pick(/\/blogs?\/|\/blog\//), pick(/\/pages?\//)].filter(Boolean);
    urls = [...new Set(urls)].slice(0, Number(a.pages ?? 5));
  }
}
if (!urls.length) {
  console.error('Usage: lighthouse.mjs --project <name> | <url...>');
  process.exit(1);
}
for (const c of ['/opt/pw-browsers/chromium', '/usr/bin/chromium', '/usr/bin/google-chrome'])
  if (!process.env.CHROME_PATH && fs.existsSync(c)) process.env.CHROME_PATH = c;
fs.mkdirSync(outDir, { recursive: true });

const cats = ['performance', 'accessibility', 'best-practices', 'seo'];
const summary = [];
for (const u of urls) {
  const file = path.join(outDir, `${today()}-${u.replace(/^https?:\/\//, '').replace(/\W+/g, '_').slice(0, 80)}.json`);
  try {
    await promisify(execFile)('npx', ['-y', 'lighthouse@13', u, '--quiet', '--output=json', `--output-path=${file}`,
      '--chrome-flags=--headless=new --no-sandbox --disable-gpu', ...(a.desktop ? ['--preset=desktop'] : [])], { maxBuffer: 1 << 26 });
  } catch (e) {
    console.log(`✗ ${u}: Lighthouse failed (${(e.stderr || e.message).toString().slice(-200)})`);
    continue;
  }
  const r = JSON.parse(fs.readFileSync(file, 'utf8'));
  const s = Object.fromEntries(cats.map((k) => [k, Math.round(r.categories[k].score * 100)]));
  summary.push({ url: u, ...s });
  console.log(`\n■ ${u}\n  performance ${s.performance} · accessibility ${s.accessibility} · best-practices ${s['best-practices']} · seo ${s.seo}`);
  for (const k of cats)
    for (const ref of r.categories[k].auditRefs) {
      const au = r.audits[ref.id];
      if (ref.weight > 0 && au.score !== null && au.score < 0.9) console.log(`  ✗ [${k}] ${au.title}${au.displayValue ? ' — ' + au.displayValue : ''}`);
    }
}
fs.writeFileSync(path.join(outDir, `${today()}-summary.json`), JSON.stringify(summary, null, 2));
console.log(`\nFull reports: ${outDir}`);
