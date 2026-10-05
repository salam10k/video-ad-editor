import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { languages, type Lang } from '@/site.config';

export type Faq = { q: string; a: string };
export type Image = { src: string; alt: string; credit?: string; creditUrl?: string; width?: number; height?: number };

type Base = {
  slug: string;
  lang: Lang;
  title: string; // H1 on the page
  metaTitle?: string; // <title> (falls back to title)
  description: string; // meta description
  translationKey: string; // same value in the AR and EN versions -> hreflang pair
  primaryKeyword: string;
  keywords: string[]; // keyword cluster
  date: string;
  updated?: string;
  cover?: Image;
  faq: Faq[];
  html: string;
  words: number;
};

export type Post = Base & { kind: 'blog' };
export type ServicePage = Base & { kind: 'service'; service: string; city: string };

const root = path.join(process.cwd(), 'content');

marked.use({
  gfm: true,
  renderer: {
    // Lazy-load every body image and open external links safely.
    image({ href, title, text }) {
      const t = title ? ` title="${title}"` : '';
      return `<img src="${href}" alt="${text}"${t} loading="lazy" decoding="async" />`;
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const t = title ? ` title="${title}"` : '';
      const external = /^https?:\/\//.test(href);
      return external
        ? `<a href="${href}"${t} target="_blank" rel="noopener">${text}</a>`
        : `<a href="${href}"${t}>${text}</a>`;
    },
  },
});

function wordCount(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`\[\]()!-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function load<T extends Post | ServicePage>(kind: 'blog' | 'services', lang: Lang): T[] {
  const dir = path.join(root, kind, lang);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      if (data.draft) return null;
      const slug = file.replace(/\.md$/, '');
      const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);
      const updated =
        data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : data.updated ? String(data.updated) : undefined;
      return {
        ...data,
        kind: kind === 'blog' ? 'blog' : 'service',
        slug,
        lang,
        date,
        updated,
        keywords: data.keywords ?? [],
        faq: data.faq ?? [],
        html: marked.parse(content) as string,
        words: wordCount(content),
      } as unknown as T;
    })
    .filter((x): x is T => x !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const getPosts = (lang: Lang) => load<Post>('blog', lang);
export const getServicePages = (lang: Lang) => load<ServicePage>('services', lang);

export const getPost = (lang: Lang, slug: string) => getPosts(lang).find((p) => p.slug === slug);
export const getServicePage = (lang: Lang, slug: string) => getServicePages(lang).find((p) => p.slug === slug);

/** URL path of a page in every language that has a version with the same translationKey. */
export function translations(item: Post | ServicePage): Partial<Record<Lang, string>> {
  const out: Partial<Record<Lang, string>> = {};
  for (const lang of languages) {
    const list = item.kind === 'blog' ? getPosts(lang) : getServicePages(lang);
    const match = list.find((x) => x.translationKey === item.translationKey);
    if (match) out[lang] = pathFor(match);
  }
  return out;
}

export function pathFor(item: Post | ServicePage) {
  return item.kind === 'blog' ? `/${item.lang}/blog/${item.slug}/` : `/${item.lang}/services/${item.slug}/`;
}

export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 200));
