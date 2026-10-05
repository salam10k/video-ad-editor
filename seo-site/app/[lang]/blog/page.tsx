import type { Lang } from '@/site.config';
import { t } from '@/lib/i18n';
import { getPosts } from '@/lib/content';
import { breadcrumbLd, pageMetadata } from '@/lib/seo';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import JsonLd from '@/components/JsonLd';
import { site } from '@/site.config';

export async function generateMetadata({ params }: PageProps<'/[lang]/blog'>) {
  const lang = (await params).lang as Lang;
  const d = t(lang);
  return pageMetadata({
    lang,
    path: `/${lang}/blog/`,
    title: `${d.blogTitle} | ${site.business.name[lang]}`,
    description: d.blogIntro,
    alternates: { ar: '/ar/blog/', en: '/en/blog/' },
  });
}

export default async function BlogIndex({ params }: PageProps<'/[lang]/blog'>) {
  const lang = (await params).lang as Lang;
  const d = t(lang);
  const posts = getPosts(lang);
  const crumbs = [
    { name: d.home, path: `/${lang}/` },
    { name: d.blog, path: `/${lang}/blog/` },
  ];
  return (
    <>
      <Header lang={lang} altPath={lang === 'ar' ? '/en/blog/' : '/ar/blog/'} />
      <main className="section">
        <div className="container">
          <Breadcrumbs items={crumbs} />
          <h1>{d.blogTitle}</h1>
          <p className="section-intro">{d.blogIntro}</p>
          <div className="grid grid-3">
            {posts.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </div>
      </main>
      <CtaBand lang={lang} />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </>
  );
}
