// /llms.txt — a plain-text map of the site for AI assistants (ChatGPT, Claude, Perplexity). Helps "AI SEO".
import { languages, site } from '@/site.config';
import { getPosts, getServicePages, pathFor } from '@/lib/content';

export const dynamic = 'force-static';

export function GET() {
  const b = site.business;
  const lines = [`# ${b.name.en} (${b.name.ar})`, '', `> ${b.tagline.en}`, '', `Phone: ${b.phone}`, `Areas served: ${site.cities.map((c) => c.name.en).join(', ')}`, ''];
  for (const lang of languages) {
    lines.push(`## ${lang === 'ar' ? 'Services (Arabic)' : 'Services (English)'}`);
    for (const p of getServicePages(lang)) lines.push(`- [${p.title}](${site.url}${pathFor(p)}): ${p.description}`);
    lines.push('', `## ${lang === 'ar' ? 'Articles (Arabic)' : 'Articles (English)'}`);
    for (const p of getPosts(lang)) lines.push(`- [${p.title}](${site.url}${pathFor(p)}): ${p.description}`);
    lines.push('');
  }
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
