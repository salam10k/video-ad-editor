import Link from 'next/link';
import { site, type Lang } from '@/site.config';
import { otherLang, t } from '@/lib/i18n';

export default function Header({ lang, altPath }: { lang: Lang; altPath?: string }) {
  const d = t(lang);
  const other = otherLang(lang);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={`/${lang}/`} className="logo">
          <span className="logo-mark" aria-hidden="true">●</span>
          {site.business.name[lang]}
        </Link>
        <nav aria-label={d.home} className="nav">
          <Link href={`/${lang}/services/`}>{d.services}</Link>
          <Link href={`/${lang}/blog/`}>{d.blog}</Link>
          <Link href={altPath ?? `/${other}/`} hrefLang={other} lang={other} className="lang-switch">
            {d.switchLang}
          </Link>
          <a href={`tel:${site.business.phone}`} className="btn btn-small">
            {d.callNow}
          </a>
        </nav>
      </div>
    </header>
  );
}
