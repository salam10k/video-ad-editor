import Link from 'next/link';
import type { Post } from '@/lib/content';
import { readingMinutes } from '@/lib/content';
import { formatDate, t } from '@/lib/i18n';

export default function PostCard({ post }: { post: Post }) {
  const d = t(post.lang);
  return (
    <article className="card post-card">
      {post.cover && (
        <img src={post.cover.src} alt={post.cover.alt} width={640} height={360} loading="lazy" decoding="async" />
      )}
      <div className="card-body">
        <p className="meta">
          {formatDate(post.date, post.lang)} · {readingMinutes(post.words)} {d.minRead}
        </p>
        <h3>
          <Link href={`/${post.lang}/blog/${post.slug}/`}>{post.title}</Link>
        </h3>
        <p>{post.description}</p>
      </div>
    </article>
  );
}
