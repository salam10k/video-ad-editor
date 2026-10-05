import type { MetadataRoute } from 'next';
import { languages, site } from '@/site.config';
import { getPosts, getServicePages, pathFor, translations } from '@/lib/content';
import { alternatesFor } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const today = new Date().toISOString().slice(0, 10);

  for (const section of ['', 'services/', 'blog/']) {
    const paths = Object.fromEntries(languages.map((l) => [l, `/${l}/${section}`]));
    for (const l of languages) {
      entries.push({
        url: `${site.url}/${l}/${section}`,
        lastModified: today,
        changeFrequency: section === 'blog/' ? 'daily' : 'weekly',
        priority: section === '' ? 1 : 0.8,
        alternates: { languages: alternatesFor(paths) },
      });
    }
  }

  for (const lang of languages) {
    for (const item of [...getServicePages(lang), ...getPosts(lang)]) {
      entries.push({
        url: `${site.url}${pathFor(item)}`,
        lastModified: item.updated ?? item.date,
        changeFrequency: 'monthly',
        priority: item.kind === 'service' ? 0.9 : 0.7,
        alternates: { languages: alternatesFor(translations(item)) },
      });
    }
  }
  return entries;
}
