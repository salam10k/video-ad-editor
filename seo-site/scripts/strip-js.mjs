#!/usr/bin/env node
// Post-build: every page is static HTML with no interactivity (links, <details> FAQ and the form all work natively),
// so we remove the Next.js client runtime. Result: zero JavaScript, instant LCP, Lighthouse performance 100.
// Kept: JSON-LD structured data and any <script data-keep> (e.g. Google Analytics).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib.mjs';

const out = path.join(ROOT, 'out');
let files = 0;
let bytes = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) strip(p);
  }
}

function strip(file) {
  const before = fs.readFileSync(file, 'utf8');
  const after = before
    .replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (m, attrs) =>
      /application\/ld\+json|data-keep/.test(attrs) ? m : '')
    .replace(/<link\b[^>]*rel="(?:preload|modulepreload)"[^>]*as="script"[^>]*\/?>/gi, '')
    .replace(/<link\b[^>]*as="script"[^>]*rel="(?:preload|modulepreload)"[^>]*\/?>/gi, '');
  if (after !== before) {
    fs.writeFileSync(file, after);
    files++;
    bytes += before.length - after.length;
  }
}

if (!fs.existsSync(out)) process.exit(0);
walk(out);
console.log(`strip-js: removed client runtime from ${files} pages (${Math.round(bytes / 1024)} KB of inline payload)`);
