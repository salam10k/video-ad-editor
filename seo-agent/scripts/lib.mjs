// Shared helpers. No dependencies except gray-matter. Works for any language.
import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

export function loadEnv() {
  try {
    process.loadEnvFile(path.join(ROOT, '.env'));
  } catch {
    /* no .env */
  }
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

/** Project profile: projects/<name>/project.json */
export function loadProject(name) {
  if (!name) throw new Error('Missing --project <name>. See projects/ for available projects.');
  const dir = path.join(ROOT, 'projects', name);
  const file = path.join(dir, 'project.json');
  if (!fs.existsSync(file)) throw new Error(`No project profile at projects/${name}/project.json (run /new-project).`);
  const p = JSON.parse(fs.readFileSync(file, 'utf8'));
  p.dir = dir;
  p.reportsDir = path.join(dir, 'reports');
  fs.mkdirSync(p.reportsDir, { recursive: true });
  return p;
}

/**
 * Normalize text for keyword matching in any language:
 * lowercase, strip Latin diacritics (ä→a, é→e), ß→ss, Arabic tashkeel/alef/ta-marbuta forms, punctuation.
 */
export function norm(s = '') {
  return String(s)
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Every word of the keyword appears in the text (order-free, tolerant to prefixes/inflection). */
export function containsKeyword(text, keyword) {
  const t = norm(text);
  return norm(keyword)
    .split(' ')
    .filter(Boolean)
    .every((w) => t.includes(w));
}

export const stripTags = (h = '') =>
  h
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#?[a-z0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const wordsOf = (text) => text.split(/\s+/).filter(Boolean);

export function today() {
  return new Date().toISOString().slice(0, 10);
}

/** Minimal CSV parser (quotes, BOM, , ; or tab). */
export function parseCsv(text) {
  text = text.replace(/^﻿/, '');
  const first = text.split(/\r?\n/)[0];
  const delim = [',', ';', '\t'].sort((a, b) => first.split(b).length - first.split(a).length)[0];
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
