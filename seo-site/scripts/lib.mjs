// Shared helpers for the scripts (no dependencies beyond gray-matter).
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export const LANGS = ['ar', 'en'];

export function loadEnv() {
  try {
    process.loadEnvFile(path.join(ROOT, '.env'));
  } catch {
    /* no .env yet */
  }
}

/** Normalize Arabic/English text for keyword matching (diacritics, alef forms, taa marbuta, case). */
export function norm(s = '') {
  return String(s)
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, '') // tashkeel + tatweel
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** True when every word of the keyword appears in the text (order-free, prefix-tolerant for Arabic). */
export function containsKeyword(text, keyword) {
  const t = norm(text);
  return norm(keyword)
    .split(' ')
    .filter(Boolean)
    .every((w) => t.includes(w));
}

export function readContent() {
  const items = [];
  for (const kind of ['blog', 'services']) {
    for (const lang of LANGS) {
      const dir = path.join(ROOT, 'content', kind, lang);
      if (!fs.existsSync(dir)) continue;
      for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith('.md') || file.startsWith('_')) continue;
        const full = path.join(dir, file);
        const { data, content } = matter(fs.readFileSync(full, 'utf8'));
        items.push({ kind, lang, slug: file.replace(/\.md$/, ''), file: path.relative(ROOT, full), data, body: content });
      }
    }
  }
  return items;
}

/** Minimal RFC-4180 CSV parser (handles quotes, commas and newlines inside quotes, BOM, ; or , or tab). */
export function parseCsv(text) {
  text = text.replace(/^﻿/, '');
  const firstLine = text.split(/\r?\n/)[0];
  const delim = [',', ';', '\t'].sort((a, b) => firstLine.split(b).length - firstLine.split(a).length)[0];
  const rows = [];
  let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === delim) { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((x) => x !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((x) => x !== '')) rows.push(row);
  const header = rows.shift()?.map((h) => h.trim()) ?? [];
  return rows.map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

/** Find a column by any of several (case-insensitive) names — works with Semrush, Ahrefs, or hand-made CSVs. */
export function col(row, ...names) {
  const keys = Object.keys(row);
  for (const n of names) {
    const k = keys.find((x) => x.toLowerCase() === n.toLowerCase());
    if (k !== undefined) return row[k];
  }
  for (const n of names) {
    const k = keys.find((x) => x.toLowerCase().startsWith(n.toLowerCase()));
    if (k !== undefined) return row[k];
  }
  return undefined;
}

export const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : NaN;
};

export function readLog() {
  const p = path.join(ROOT, 'data', 'publish-log.json');
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
}

export function args(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      out[k] = v ?? (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true);
    } else out._.push(a);
  }
  return out;
}
