import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cityByKey, languages, serviceByKey, site, type Lang } from '@/site.config';
import { otherLang, t } from '@/lib/i18n';
import { getPosts, getServicePage, getServicePages, pathFor, translations } from '@/lib/content';
import { breadcrumbLd, businessLd, faqLd, pageMetadata, serviceLd } from '@/lib/seo';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import Faq from '@/components/Faq';
import LeadForm from '@/components/LeadForm';
import Stats from '@/components/Stats';
import PostCard from '@/components/PostCard';
import CtaBand from '@/components/CtaBand';
import JsonLd from '@/components/JsonLd';

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.flatMap((lang) => getServicePages(lang).map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/services/[slug]'>) {
  const { lang, slug } = (await params) as { lang: Lang; slug: string };
  const page = getServicePage(lang, slug);
  if (!page) return {};
  return pageMetadata({
    lang,
    path: pathFor(page),
    title: page.metaTitle ?? page.title,
    description: page.description,
    alternates: translations(page),
    image: page.cover?.src,
  });
}

/** Service page = the homepage layout (proven to convert) focused on one service + one city. */
export default async function ServicePageView({ params }: PageProps<'/[lang]/services/[slug]'>) {
  const { lang, slug } = (await params) as { lang: Lang; slug: string };
  const page = getServicePage(lang, slug);
  if (!page) notFound();
  const d = t(lang);
  const b = site.business;
  const service = serviceByKey(page.service);
  const city = cityByKey(page.city);
  const serviceName = service?.name[lang] ?? page.service;
  const cityName = city?.name[lang] ?? page.city;
  const path = pathFor(page);
  const all = getServicePages(lang).filter((p) => p.slug !== slug);
  const sameServiceOtherCities = all.filter((p) => p.service === page.service);
  const otherServicesSameCity = all.filter((p) => p.city === page.city);
  const posts = getPosts(lang)
    .filter((p) => p.keywords.some((k) => page.keywords.includes(k)) || p.primaryKeyword.includes(serviceName))
    .slice(0, 3);
  const crumbs = [
    { name: d.home, path: `/${lang}/` },
    { name: d.services, path: `/${lang}/services/` },
    { name: page.title, path },
  ];

  return (
    <>
      <Header lang={lang} altPath={translations(page)[otherLang(lang)]} />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <Breadcrumbs items={crumbs} />
              <p className="eyebrow">{serviceName} · {cityName}</p>
              <h1>{page.title}</h1>
              <p className="lead">{page.description}</p>
              <div className="hero-buttons">
                <a className="btn" href={`tel:${b.phone}`}>{d.callNow}</a>
                <a className="btn btn-outline" href="#quote">{d.getQuote}</a>
              </div>
              <Stats lang={lang} />
            </div>
            <LeadForm lang={lang} defaultCity={page.city} source={`service:${slug}`} />
          </div>
        </section>

        <section className="section">
          <div className="container narrow">
            {page.cover && (
              <img className="service-cover" src={page.cover.src} alt={page.cover.alt} width={1200} height={675} loading="lazy" />
            )}
            <div className="prose" dangerouslySetInnerHTML={{ __html: page.html }} />
          </div>
        </section>

        <section className="section section-alt">
          <div className="container">
            <h2>{d.howItWorks}</h2>
            <ol className="steps">
              {d.steps.map((s, i) => (
                <li key={s.t}>
                  <span className="step-num">{i + 1}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section">
          <div className="container narrow">
            <Faq items={page.faq} title={d.faq} />
          </div>
        </section>

        {(sameServiceOtherCities.length > 0 || otherServicesSameCity.length > 0) && (
          <section className="section section-alt">
            <div className="container grid grid-2">
              {sameServiceOtherCities.length > 0 && (
                <div>
                  <h2 className="h3">{d.otherCities}</h2>
                  <ul className="city-links">
                    {sameServiceOtherCities.map((p) => (
                      <li key={p.slug}><Link href={pathFor(p)}>{p.title}</Link></li>
                    ))}
                  </ul>
                </div>
              )}
              {otherServicesSameCity.length > 0 && (
                <div>
                  <h2 className="h3">{d.otherServices} {cityName}</h2>
                  <ul className="city-links">
                    {otherServicesSameCity.map((p) => (
                      <li key={p.slug}><Link href={pathFor(p)}>{p.title}</Link></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {posts.length > 0 && (
          <section className="section">
            <div className="container">
              <h2>{d.relatedPosts}</h2>
              <div className="grid grid-3">
                {posts.map((p) => <PostCard key={p.slug} post={p} />)}
              </div>
            </div>
          </section>
        )}

        <CtaBand lang={lang} />
      </main>
      <JsonLd data={serviceLd(page, serviceName, cityName, path)} />
      <JsonLd data={businessLd(lang)} />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(page.faq)} />
    </>
  );
}
