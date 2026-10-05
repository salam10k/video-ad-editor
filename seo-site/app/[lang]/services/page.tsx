import Link from 'next/link';
import { site, type Lang } from '@/site.config';
import { t } from '@/lib/i18n';
import { getServicePages } from '@/lib/content';
import { breadcrumbLd, pageMetadata } from '@/lib/seo';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata({ params }: PageProps<'/[lang]/services'>) {
  const lang = (await params).lang as Lang;
  const d = t(lang);
  return pageMetadata({
    lang,
    path: `/${lang}/services/`,
    title: `${d.servicesTitle} | ${site.business.name[lang]}`,
    description: `${d.servicesIntro} ${site.services.map((s) => s.name[lang]).join(lang === 'ar' ? '، ' : ', ')}.`,
    alternates: { ar: '/ar/services/', en: '/en/services/' },
  });
}

export default async function ServicesIndex({ params }: PageProps<'/[lang]/services'>) {
  const lang = (await params).lang as Lang;
  const d = t(lang);
  const pages = getServicePages(lang);
  const crumbs = [
    { name: d.home, path: `/${lang}/` },
    { name: d.services, path: `/${lang}/services/` },
  ];
  return (
    <>
      <Header lang={lang} altPath={lang === 'ar' ? '/en/services/' : '/ar/services/'} />
      <main className="section">
        <div className="container">
          <Breadcrumbs items={crumbs} />
          <h1>{d.servicesTitle}</h1>
          <p className="section-intro">{d.servicesIntro}</p>
          <div className="grid grid-2">
            {site.services.map((s) => {
              const forService = pages.filter((p) => p.service === s.key);
              return (
                <section className="card service-card" key={s.key}>
                  <h2 className="h3">{s.name[lang]}</h2>
                  <p>{s.blurb[lang]}</p>
                  {forService.length > 0 && (
                    <ul className="city-links">
                      {forService.map((p) => (
                        <li key={p.slug}>
                          <Link href={`/${lang}/services/${p.slug}/`}>{p.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <CtaBand lang={lang} />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </>
  );
}
