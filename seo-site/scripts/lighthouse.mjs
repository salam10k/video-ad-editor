#!/usr/bin/env node
// Runs Google Lighthouse on the built site (out/) and prints the 4 scores + every failing audit,
// so Claude can fix them until everything is 100/100.
// Usage: npm run build && node scripts/lighthouse.mjs [/ar/ /en/blog/some-post/ ...]
// Default pages: home + first blog post + first service page, in both languages. Reports go to .lighthouse/.
// Needs Chrome/Chromium installed (set CHROME_PATH if it is not found automatically).
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import zlib from 'node:zlib';
import { ROOT, args, readContent } from './lib.mjs';

const a = args();
const outDir = path.join(ROOT, 'out');
if (!fs.existsSync(outDir)) {
  console.error('No out/ folder. Run "npm run build" first.');
  process.exit(1);
}

if (!process.env.CHROME_PATH) {
  for (const p of ['/opt/pw-browsers/chromium', '/usr/bin/chromium', '/usr/bin/google-chrome']) {
    if (fs.existsSync(p)) { process.env.CHROME_PATH = p; break; }
  }
  if (!process.env.CHROME_PATH && fs.existsSync('/opt/pw-browsers')) {
    const dir = fs.readdirSync('/opt/pw-browsers').find((d) => d.startsWith('chromium-'));
    const bin = dir && path.join('/opt/pw-browsers', dir, 'chrome-linux', 'chrome');
    if (bin && fs.existsSync(bin)) process.env.CHROME_PATH = bin;
  }
}

let pages = a._;
if (!pages.length) {
  const content = readContent();
  pages = ['/ar/', '/en/'];
  for (const kind of ['blog', 'services'])
    for (const lang of ['ar', 'en']) {
      const first = content.find((c) => c.kind === kind && c.lang === lang && !c.data.draft);
      if (first) pages.push(`/${lang}/${kind}/${first.slug}/`);
    }
}

// Tiny static server for out/
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(outDir, p);
  if (p.endsWith('/')) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) file = path.join(outDir, '404.html');
  // Mimic production hosting (Vercel): gzip + long cache, so the scores match the live site.
  const gzip = /gzip/.test(req.headers['accept-encoding'] ?? '');
  res.writeHead(200, {
    'Content-Type': types[path.extname(file)] ?? 'application/octet-stream',
    'Cache-Control': 'public, max-age=31536000, immutable',
    ...(gzip ? { 'Content-Encoding': 'gzip' } : {}),
  });
  const stream = fs.createReadStream(file);
  (gzip ? stream.pipe(zlib.createGzip()) : stream).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;
const reportDir = path.join(ROOT, '.lighthouse');
fs.mkdirSync(reportDir, { recursive: true });

let allPerfect = true;
for (const p of pages) {
  const reportPath = path.join(reportDir, `${p.replace(/\W+/g, '_') || 'root'}.json`);
  try {
    // Async on purpose: a sync call would block this process's static server.
    await promisify(execFile)('npx', ['-y', 'lighthouse@13', base + p, '--quiet', '--output=json', `--output-path=${reportPath}`,
      '--chrome-flags=--headless=new --no-sandbox --disable-gpu', ...(a.desktop ? ['--preset=desktop'] : [])], { maxBuffer: 1 << 26 });
  } catch (e) {
    console.error(`Lighthouse failed on ${p}: ${e.stderr?.toString().slice(-500) ?? e.message}`);
    allPerfect = false;
    continue;
  }
  const r = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const scores = Object.fromEntries(
    ['performance', 'accessibility', 'best-practices', 'seo'].map((k) => [k, Math.round(r.categories[k].score * 100)]),
  );
  console.log(`\n■ ${p}  performance ${scores.performance} · accessibility ${scores.accessibility} · best-practices ${scores['best-practices']} · seo ${scores.seo}`);
  for (const [cat, c] of Object.entries(r.categories)) {
    if (!['performance', 'accessibility', 'best-practices', 'seo'].includes(cat)) continue;
    for (const ref of c.auditRefs) {
      const au = r.audits[ref.id];
      if (ref.weight > 0 && au.score !== null && au.score < 0.9) {
        allPerfect = false;
        console.log(`   ✗ [${cat}] ${au.title}${au.displayValue ? ` — ${au.displayValue}` : ''}`);
      }
    }
  }
  if (Object.values(scores).some((s) => s < 100)) allPerfect = false;
}
server.close();
console.log(allPerfect ? '\nAll pages 100/100.' : `\nNot perfect yet. Full reports in .lighthouse/ — fix the ✗ items above and run again.`);
process.exit(allPerfect ? 0 : 1);
