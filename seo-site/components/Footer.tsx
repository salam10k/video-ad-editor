import Link from 'next/link';
import { site, type Lang } from '@/site.config';
import { t } from '@/lib/i18n';

export default function Footer({ lang }: { lang: Lang }) {
  const d = t(lang);
  const b = site.business;
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* NAP (name, address, phone): keep identical to your Google Business Profile */}
        <div>
          <p className="footer-name">{b.name[lang]}</p>
          <p>{b.tagline[lang]}</p>
          <address>
            {b.address.street[lang]}{lang === 'ar' ? '، ' : ', '}{b.address.city[lang]}
            <br />
            <a href={`tel:${b.phone}`} dir="ltr">{b.phone}</a>
            <br />
            <a href={`mailto:${b.email}`}>{b.email}</a>
          </address>
        </div>
        <div>
          <p className="footer-title">{d.services}</p>
          <ul>
            {site.services.map((s) => (
              <li key={s.key}>{s.name[lang]}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-title">{d.contact}</p>
          <ul>
            <li><Link href={`/${lang}/services/`}>{d.allServices}</Link></li>
            <li><Link href={`/${lang}/blog/`}>{d.allPosts}</Link></li>
            <li><a href={`https://wa.me/${b.whatsapp}`} rel="noopener">{d.whatsapp}</a></li>
          </ul>
        </div>
      </div>
      <p className="container copyright">
        © {new Date().getFullYear()} {b.name[lang]} — {d.rights}
      </p>
    </footer>
  );
}
