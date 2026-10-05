import Link from 'next/link';
import { site, type Lang } from '@/site.config';
import { t } from '@/lib/i18n';
import { getPosts, getServicePages } from '@/lib/content';
import { businessLd, pageMetadata, websiteLd } from '@/lib/seo';
import Header from '@/components/Header';
import LeadForm from '@/components/LeadForm';
import Stats from '@/components/Stats';
import PostCard from '@/components/PostCard';
import CtaBand from '@/components/CtaBand';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata({ params }: PageProps<'/[lang]'>) {
  const lang = (await params).lang as Lang;
  const b = site.business;
  return pageMetadata({
    lang,
    path: `/${lang}/`,
    title: `${b.name[lang]} | ${b.tagline[lang]}`,
    description: `${b.tagline[lang]}. ${site.services.map((s) => s.name[lang]).join(lang === 'ar' ? '، ' : ', ')}.`,
    alternates: { ar: '/ar/', en: '/en/' },
  });
}

export default async function Home({ params }: PageProps<'/[lang]'>) {
  const lang = (await params).lang as Lang;
  const d = t(lang);
  const b = site.business;
  const posts = getPosts(lang).slice(0, 3);
  const servicePages = getServicePages(lang);

  return (
    <>
      <Header lang={lang} />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">{site.cities.map((c) => c.name[lang]).join(' · ')}</p>
              <h1>{b.name[lang]}</h1>
              <p className="lead">{b.tagline[lang]}</p>
              <div className="hero-buttons">
                <a className="btn" href={`tel:${b.phone}`}>{d.callNow}</a>
                <a className="btn btn-outline" href="#quote">{d.getQuote}</a>
              </div>
              <Stats lang={lang} />
            </div>
            <LeadForm lang={lang} source="home" />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2>{d.servicesTitle}</h2>
            <p className="section-intro">{d.servicesIntro}</p>
            <div className="grid grid-4">
              {site.services.map((s) => {
                const page = servicePages.find((p) => p.service === s.key);
                return (
                  <div className="card service-card" key={s.key}>
                    <h3>{page ? <Link href={`/${lang}/services/${page.slug}/`}>{s.name[lang]}</Link> : s.name[lang]}</h3>
                    <p>{s.blurb[lang]}</p>
                  </div>
                );
              })}
            </div>
            <p className="more"><Link href={`/${lang}/services/`}>{d.allServices}</Link></p>
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

        {posts.length > 0 && (
          <section className="section">
            <div className="container">
              <h2>{d.latestPosts}</h2>
              <div className="grid grid-3">
                {posts.map((p) => <PostCard key={p.slug} post={p} />)}
              </div>
              <p className="more"><Link href={`/${lang}/blog/`}>{d.allPosts}</Link></p>
            </div>
          </section>
        )}

        <CtaBand lang={lang} />
      </main>
      <JsonLd data={businessLd(lang)} />
      <JsonLd data={websiteLd(lang)} />
    </>
  );
}
