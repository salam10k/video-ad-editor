#!/usr/bin/env node
// Step 2 of "analyze": turn the latest crawl into a prioritized list of problems with a fix for each.
// Usage: node scripts/audit.mjs --project <name> [--crawl reports/crawl-YYYY-MM-DD.json]
// Output: reports/audit-YYYY-MM-DD.md (for humans) + reports/issues-YYYY-MM-DD.json (for /fix)
import fs from 'node:fs';
import path from 'node:path';
import { args, containsKeyword, loadProject, norm, parseCsv, today } from './lib.mjs';

const a = args();
const project = loadProject(a.project);
const crawlFile =
  a.crawl ??
  fs.readdirSync(project.reportsDir).filter((f) => f.startsWith('crawl-')).sort().map((f) => path.join(project.reportsDir, f)).pop();
if (!crawlFile) {
  console.error('No crawl found. Run: npm run crawl -- --project ' + a.project);
  process.exit(1);
}
const crawl = JSON.parse(fs.readFileSync(crawlFile, 'utf8'));
const pages = crawl.pages.filter((p) => p.status === 200 && !/noindex/i.test(p.robots + p.xRobots));
const L = project.limits ?? {};
const lim = { titleMin: 30, titleMax: 60, descMin: 110, descMax: 160, thinWords: 250, ...L };
const fixHint = hints(project.platform);

const issues = [];
const add = (severity, id, title, urls, fix, detail = '') =>
  issues.push({ severity, id, title, count: urls.length, urls: urls.slice(0, 50), fix, detail });

// ---------- Site-level (critical) ----------
const blocked = crawl.pages.filter((p) => p.passwordProtected);
if (blocked.length)
  add('critical', 'password', 'Site is password-protected / "coming soon" — Google cannot see any page', blocked.map((p) => p.url), fixHint.password);
if (/^\s*disallow:\s*\/\s*$/im.test(crawl.robotsTxt.body) && /user-agent:\s*\*/i.test(crawl.robotsTxt.body))
  add('critical', 'robots-block', 'robots.txt blocks the whole site (Disallow: /)', [`${crawl.origin}/robots.txt`], 'Remove "Disallow: /" for User-agent: * (keep it only for admin/cart/checkout paths).');
if (crawl.robotsTxt.status !== 200) add('medium', 'robots-missing', 'No robots.txt', [`${crawl.origin}/robots.txt`], 'Add a robots.txt that allows crawling and links the sitemap.');
const foreignSitemaps = crawl.sitemaps.filter((u) => !u.startsWith(crawl.origin));
if (foreignSitemaps.length)
  add('high', 'sitemap-domain', 'robots.txt points to a sitemap on a different domain (wrong site URL setting)', foreignSitemaps, 'Set the real domain in the platform/site settings (e.g. NEXT_PUBLIC_SITE_URL, WordPress Site Address, Shopify primary domain), then regenerate robots.txt and the sitemap.');
else if (!crawl.sitemapUrlCount && crawl.sitemapRawCount)
  add('high', 'sitemap-domain', 'sitemap.xml lists URLs on a different domain (wrong site URL setting)', crawl.sitemapForeign ?? [], 'Set the real domain in the platform/site settings (e.g. NEXT_PUBLIC_SITE_URL, WordPress Site Address, Shopify primary domain) and regenerate the sitemap.');
else if (!crawl.sitemapUrlCount) add('high', 'sitemap-missing', 'No sitemap.xml found (or it is empty)', [crawl.sitemaps.join(', ')], fixHint.sitemap);
const noindexed = crawl.pages.filter((p) => p.status === 200 && /noindex/i.test(p.robots + p.xRobots));
if (noindexed.length) add('high', 'noindex', 'Pages set to noindex (Google will drop them)', noindexed.map((p) => p.url), 'Remove noindex unless the page should really stay out of Google (cart, account, thank-you).');

// ---------- Errors ----------
const broken = Object.entries(crawl.linkStatus).filter(([, s]) => s >= 400 || s === 0).map(([u]) => u);
if (broken.length) add('high', 'broken-links', 'Broken internal links (404/5xx/unreachable)', broken, 'Fix or redirect (301) each broken URL; update the links pointing to it.');
const slow = pages.filter((p) => p.ms > 3000);
if (slow.length) add('medium', 'slow', 'Slow server response (> 3 s)', slow.map((p) => `${p.url} (${p.ms} ms)`), 'Run /tech-seo (Lighthouse) on these pages; compress images, remove unused apps/scripts.');

// ---------- Titles & descriptions ----------
const noTitle = pages.filter((p) => !p.title);
if (noTitle.length) add('high', 'title-missing', 'Missing <title>', noTitle.map((p) => p.url), fixHint.meta);
const badTitle = pages.filter((p) => p.title && (p.title.length < lim.titleMin || p.title.length > lim.titleMax));
if (badTitle.length) add('medium', 'title-length', `Title length outside ${lim.titleMin}–${lim.titleMax} chars`, badTitle.map((p) => `${p.url} (${p.title.length}: "${p.title}")`), fixHint.meta);
const dupTitle = groupDup(pages, (p) => norm(p.title));
if (dupTitle.length) add('high', 'title-duplicate', 'Duplicate titles (pages compete with each other)', dupTitle, fixHint.meta);
const noDesc = pages.filter((p) => !p.description);
if (noDesc.length) add('high', 'desc-missing', 'Missing meta description', noDesc.map((p) => p.url), fixHint.meta);
const badDesc = pages.filter((p) => p.description && (p.description.length < lim.descMin || p.description.length > lim.descMax));
if (badDesc.length) add('low', 'desc-length', `Meta description outside ${lim.descMin}–${lim.descMax} chars`, badDesc.map((p) => `${p.url} (${p.description.length})`), fixHint.meta);
const dupDesc = groupDup(pages.filter((p) => p.description), (p) => norm(p.description));
if (dupDesc.length) add('medium', 'desc-duplicate', 'Duplicate meta descriptions', dupDesc, fixHint.meta);

// ---------- Headings & content ----------
const noH1 = pages.filter((p) => p.h1.length === 0);
if (noH1.length) add('high', 'h1-missing', 'No H1 heading', noH1.map((p) => p.url), fixHint.h1);
const multiH1 = pages.filter((p) => p.h1.length > 1);
if (multiH1.length) add('low', 'h1-multiple', 'More than one H1', multiH1.map((p) => `${p.url} (${p.h1.length})`), fixHint.h1);
const thin = pages.filter((p) => p.words < lim.thinWords);
if (thin.length) add('medium', 'thin', `Thin content (< ${lim.thinWords} words in main area)`, thin.map((p) => `${p.url} (${p.words})`), 'Expand with useful text: what it is, who it is for, how to use it, FAQ. Use /write for blog posts and /fix for product/category text.');

// ---------- Images ----------
const noAlt = pages.filter((p) => p.imagesNoAlt.length);
if (noAlt.length) add('medium', 'alt-missing', 'Images without alt text', noAlt.map((p) => `${p.url} (${p.imagesNoAlt.length})`), fixHint.alt);

// ---------- Technical tags ----------
const noCanon = pages.filter((p) => !p.canonical);
if (noCanon.length) add('medium', 'canonical-missing', 'No canonical URL', noCanon.map((p) => p.url), 'Add <link rel="canonical"> (most platforms do this automatically — check the theme).');
const noLang = pages.filter((p) => !p.lang);
if (noLang.length) add('low', 'lang-missing', 'No lang attribute on <html>', noLang.map((p) => p.url), 'Set the store/site language in the platform settings or theme.');
const wrongLang = project.languages?.length
  ? pages.filter((p) => p.lang && !project.languages.some((l) => p.lang.toLowerCase().startsWith(l.toLowerCase())))
  : [];
if (wrongLang.length) add('medium', 'lang-wrong', `Page language not in project languages (${project.languages.join(', ')})`, wrongLang.map((p) => `${p.url} (${p.lang})`), 'Fix the language setting or add hreflang for each language version.');
const noSchema = pages.filter((p) => !p.structuredData.length);
if (noSchema.length) add('low', 'schema-missing', 'No structured data (JSON-LD)', noSchema.map((p) => p.url), fixHint.schema);
const badSchema = pages.filter((p) => p.structuredData.includes('INVALID_JSON_LD'));
if (badSchema.length) add('medium', 'schema-invalid', 'Invalid JSON-LD', badSchema.map((p) => p.url), 'Validate at https://search.google.com/test/rich-results and fix the theme/app that outputs it.');
const noOg = pages.filter((p) => !p.ogImage);
if (noOg.length) add('low', 'og-missing', 'No og:image (ugly link previews on WhatsApp/social)', noOg.map((p) => p.url), 'Set a social sharing image in the platform/theme settings.');

// ---------- Orphans ----------
const linkedTo = new Set(pages.flatMap((p) => p.internalLinks));
const orphans = pages.filter((p) => !linkedTo.has(p.url) && p.url !== crawl.origin + '/');
if (orphans.length) add('medium', 'orphan', 'Orphan pages (in sitemap, but no internal link points to them)', orphans.map((p) => p.url), 'Link to each from a related page, collection or menu.');

// ---------- Keyword opportunities (from projects/<name>/keywords.csv) ----------
const kwFile = path.join(project.dir, 'keywords.csv');
const opportunities = [];
if (fs.existsSync(kwFile)) {
  const rows = parseCsv(fs.readFileSync(kwFile, 'utf8'));
  for (const r of rows) {
    const kw = r.keyword ?? r.Keyword;
    if (!kw) continue;
    const target = pages.find((p) => containsKeyword(`${p.title} ${p.h1.join(' ')}`, kw));
    opportunities.push({ keyword: kw, volume: Number(r.volume ?? r.Volume ?? 0), kd: r.kd ?? r['Keyword Difficulty'] ?? '', intent: r.intent ?? r.Intent ?? '', targetPage: target?.url ?? '', group: r.group ?? '' });
  }
  const gaps = opportunities.filter((o) => !o.targetPage).sort((x, y) => y.volume - x.volume);
  if (gaps.length)
    add('medium', 'keyword-gap', 'Keywords with search demand but no page targeting them', gaps.map((g) => `${g.keyword} (${g.volume}/mo${g.intent ? ', ' + g.intent : ''})`), 'Create a page per keyword (informational → /write blog post; buying intent → product/collection/service page), or retarget an existing page.');
}

function groupDup(list, key) {
  const m = new Map();
  for (const p of list) {
    const k = key(p);
    if (!k) continue;
    m.set(k, [...(m.get(k) ?? []), p.url]);
  }
  return [...m.values()].filter((v) => v.length > 1).map((v) => v.join('  =  '));
}

// ---------- Score & write ----------
const weight = { critical: 30, high: 8, medium: 3, low: 1 };
const score = Math.max(0, 100 - issues.reduce((s, i) => s + weight[i.severity] * Math.min(3, Math.ceil(i.count / 5)), 0));
const order = ['critical', 'high', 'medium', 'low'];
issues.sort((x, y) => order.indexOf(x.severity) - order.indexOf(y.severity) || y.count - x.count);

const icon = { critical: '🔴', high: '🟠', medium: '🟡', low: '⚪' };
let md = `# SEO audit — ${project.name}\n\n${crawl.origin} · ${crawl.date} · platform: ${project.platform} · languages: ${(project.languages ?? []).join(', ')}\n\n`;
md += `**Score: ${score}/100** · ${crawl.pages.length} pages crawled · ${pages.length} indexable · ${issues.length} problem types\n\n`;
md += `| | Problem | Pages | Fix |\n|---|---|---|---|\n`;
for (const i of issues) md += `| ${icon[i.severity]} | ${i.title} | ${i.count} | ${i.fix} |\n`;
md += `\n## Details\n`;
for (const i of issues) md += `\n### ${icon[i.severity]} ${i.title} (${i.count})\n\n${i.urls.map((u) => `- ${u}`).join('\n')}\n`;
if (opportunities.length) {
  md += `\n## Keyword coverage\n\n| Keyword | Volume | Intent | Page targeting it |\n|---|---|---|---|\n`;
  for (const o of opportunities.sort((x, y) => y.volume - x.volume)) md += `| ${o.keyword} | ${o.volume} | ${o.intent} | ${o.targetPage || '— none —'} |\n`;
}
const mdOut = path.join(project.reportsDir, `audit-${today()}.md`);
const jsonOut = path.join(project.reportsDir, `issues-${today()}.json`);
fs.writeFileSync(mdOut, md);
fs.writeFileSync(jsonOut, JSON.stringify({ score, date: today(), issues, opportunities }, null, 2));
console.log(`Score ${score}/100 · ${issues.length} problem types`);
for (const i of issues) console.log(`  ${icon[i.severity]} ${i.title} — ${i.count}`);
console.log(`\nReport: ${path.relative(process.cwd(), mdOut)}\nIssues for /fix: ${path.relative(process.cwd(), jsonOut)}`);

// Platform-specific fix instructions used above (function declaration = hoisted).
function hints(platform) {
  const generic = {
    password: 'Remove the password / maintenance mode when you launch. Until then nothing can rank.',
    sitemap: 'Generate a sitemap.xml (plugin or framework) and submit it in Google Search Console.',
    meta: 'Write a unique title (30–60 chars, main keyword first) and description (110–160 chars, with a reason to click) for each page.',
    h1: 'Each page needs exactly one H1 containing its main keyword (usually the page/product title in the theme).',
    alt: 'Describe each image in the page language, with a keyword where natural.',
    schema: 'Add JSON-LD (Product, Article, FAQPage, LocalBusiness, BreadcrumbList) via the theme or an SEO plugin.',
  };
  const map = {
    shopify: {
      password: 'Shopify Admin → Online Store → Preferences → Password protection → turn off (when you launch).',
      sitemap: 'Shopify creates /sitemap.xml automatically once the store is public. Submit it in Search Console.',
      meta: 'Shopify Admin → product/collection/page/blog post → "Search engine listing" → Edit (page title + meta description + URL handle). Home page: Online Store → Preferences.',
      h1: 'In Shopify the H1 is the product/collection/page title, set by the theme. Rename the title to include the keyword.',
      alt: 'Shopify Admin → Products → click each image → "Add alt text".',
      schema: 'Most Shopify themes output Product JSON-LD; add FAQ/Article schema with the theme editor or an SEO app.',
    },
    wordpress: {
      password: 'Disable the maintenance/coming-soon plugin and Settings → Reading → uncheck "Discourage search engines".',
      sitemap: 'Use Yoast/Rank Math (sitemap_index.xml) or WordPress core /wp-sitemap.xml.',
      meta: 'Edit the post/page → Yoast/Rank Math box → SEO title + meta description.',
      h1: 'The post/page title is the H1 in most themes; avoid adding another H1 block in the content.',
      alt: 'Media Library → each image → Alternative Text.',
      schema: 'Yoast/Rank Math add Article/Organization schema; add FAQ blocks for FAQPage.',
    },
    salla: {
      meta: 'لوحة سلة → المنتج/الصفحة → تحسينات SEO → عنوان الصفحة ووصفها.',
      alt: 'لوحة سلة → المنتج → الصور → النص البديل.',
    },
    zid: {
      meta: 'لوحة زد → المنتج → تحسين محركات البحث → العنوان والوصف.',
    },
    static: {
      sitemap: 'Generate sitemap.xml at build time (framework route or plugin).',
      meta: 'Edit the page front matter / <head> metadata in the code.',
    },
  };
  return { ...generic, ...(map[platform] ?? {}) };
}
