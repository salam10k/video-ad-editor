import type { Metadata } from 'next';
import { defaultLang, languages, site, type Lang } from '@/site.config';
import { locale } from '@/lib/i18n';
import type { Faq, Post, ServicePage } from '@/lib/content';

export const abs = (p: string) => (p.startsWith('http') ? p : `${site.url}${p}`);

/** Same page in every language. Pass the paths that exist; missing ones are skipped. */
export function alternatesFor(paths: Partial<Record<Lang, string>>) {
  const languagesMap: Record<string, string> = {};
  for (const l of languages) if (paths[l]) languagesMap[l] = abs(paths[l]!);
  const xDefault = paths[defaultLang] ?? Object.values(paths)[0];
  if (xDefault) languagesMap['x-default'] = abs(xDefault);
  return languagesMap;
}

export function pageMetadata(opts: {
  lang: Lang;
  path: string;
  title: string;
  description: string;
  alternates: Partial<Record<Lang, string>>;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const url = abs(opts.path);
  const images = opts.image ? [{ url: abs(opts.image) }] : undefined;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url, languages: alternatesFor(opts.alternates) },
    openGraph: {
      type: opts.type ?? 'website',
      url,
      title: opts.title,
      description: opts.description,
      siteName: site.business.name[opts.lang],
      locale: locale(opts.lang),
      images,
      ...(opts.type === 'article' ? { publishedTime: opts.publishedTime, modifiedTime: opts.modifiedTime } : {}),
    },
    twitter: { card: opts.image ? 'summary_large_image' : 'summary', title: opts.title, description: opts.description },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD (structured data)
// ---------------------------------------------------------------------------

export function businessLd(lang: Lang) {
  const b = site.business;
  return {
    '@context': 'https://schema.org',
    '@type': b.schemaType,
    '@id': `${site.url}/#business`,
    name: b.name[lang],
    description: b.tagline[lang],
    url: abs(`/${lang}/`),
    telephone: b.phone,
    email: b.email,
    priceRange: b.priceRange,
    foundingDate: String(b.foundingYear),
    openingHours: b.openingHours,
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.address.street[lang],
      addressLocality: b.address.city[lang],
      addressRegion: b.address.region[lang],
      postalCode: b.address.postalCode,
      addressCountry: b.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: b.geo.lat, longitude: b.geo.lng },
    areaServed: site.cities.map((c) => ({ '@type': 'City', name: c.name[lang] })),
    sameAs: b.sameAs.length ? b.sameAs : undefined,
  };
}

export function websiteLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.business.name[lang],
    url: abs(`/${lang}/`),
    inLanguage: lang,
    publisher: { '@id': `${site.url}/#business` },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqLd(faq: Faq[]) {
  if (!faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function articleLd(post: Post, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    inLanguage: post.lang,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    mainEntityOfPage: abs(path),
    image: post.cover ? abs(post.cover.src) : undefined,
    keywords: [post.primaryKeyword, ...post.keywords].join(', '),
    wordCount: post.words,
    author: { '@type': 'Organization', name: site.business.name[post.lang], url: abs(`/${post.lang}/`) },
    publisher: { '@id': `${site.url}/#business` },
  };
}

export function serviceLd(page: ServicePage, serviceName: string, cityName: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    serviceType: serviceName,
    description: page.description,
    url: abs(path),
    areaServed: { '@type': 'City', name: cityName },
    provider: { '@id': `${site.url}/#business` },
  };
}
