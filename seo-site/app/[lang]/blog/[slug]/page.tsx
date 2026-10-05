import Link from 'next/link';
import { notFound } from 'next/navigation';
import { languages, type Lang } from '@/site.config';
import { formatDate, otherLang, t } from '@/lib/i18n';
import { getPost, getPosts, pathFor, readingMinutes, translations } from '@/lib/content';
import { articleLd, breadcrumbLd, faqLd, pageMetadata } from '@/lib/seo';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import Faq from '@/components/Faq';
import LeadForm from '@/components/LeadForm';
import PostCard from '@/components/PostCard';
import CtaBand from '@/components/CtaBand';
import JsonLd from '@/components/JsonLd';

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.flatMap((lang) => getPosts(lang).map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/blog/[slug]'>) {
  const { lang, slug } = (await params) as { lang: Lang; slug: string };
  const post = getPost(lang, slug);
  if (!post) return {};
  return pageMetadata({
    lang,
    path: pathFor(post),
    title: post.metaTitle ?? post.title,
    description: post.description,
    alternates: translations(post),
    image: post.cover?.src,
    type: 'article',
    publishedTime: post.date,
    modifiedTime: post.updated ?? post.date,
  });
}

export default async function PostPage({ params }: PageProps<'/[lang]/blog/[slug]'>) {
  const { lang, slug } = (await params) as { lang: Lang; slug: string };
  const post = getPost(lang, slug);
  if (!post) notFound();
  const d = t(lang);
  const path = pathFor(post);
  const alt = translations(post)[otherLang(lang)];
  const related = getPosts(lang)
    .filter((p) => p.slug !== slug)
    .map((p) => ({ p, score: p.keywords.filter((k) => post.keywords.includes(k)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.p);
  const crumbs = [
    { name: d.home, path: `/${lang}/` },
    { name: d.blog, path: `/${lang}/blog/` },
    { name: post.title, path },
  ];

  return (
    <>
      <Header lang={lang} altPath={alt} />
      <main className="section">
        <div className="container article-grid">
          <article className="article">
            <Breadcrumbs items={crumbs} />
            <h1>{post.title}</h1>
            <p className="meta">
              <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
              {post.updated && (
                <> · {d.updated} <time dateTime={post.updated}>{formatDate(post.updated, lang)}</time></>
              )}
              {' '}· {readingMinutes(post.words)} {d.minRead}
            </p>
            {post.cover && (
              <figure className="cover">
                <img src={post.cover.src} alt={post.cover.alt} width={1200} height={675} fetchPriority="high" />
                {post.cover.credit && (
                  <figcaption>
                    {d.photoBy}{' '}
                    {post.cover.creditUrl ? <a href={post.cover.creditUrl} rel="noopener">{post.cover.credit}</a> : post.cover.credit}{' '}
                    {d.onPexels}
                  </figcaption>
                )}
              </figure>
            )}
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
            <Faq items={post.faq} title={d.faq} />
          </article>
          <aside className="sidebar">
            <LeadForm lang={lang} source={`blog:${slug}`} />
          </aside>
        </div>
        {related.length > 0 && (
          <div className="container related">
            <h2>{d.relatedPosts}</h2>
            <div className="grid grid-3">
              {related.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
            <p className="more"><Link href={`/${lang}/blog/`}>{d.allPosts}</Link></p>
          </div>
        )}
      </main>
      <CtaBand lang={lang} />
      <JsonLd data={articleLd(post, path)} />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(post.faq)} />
    </>
  );
}
