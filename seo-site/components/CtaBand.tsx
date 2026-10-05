import { site, type Lang } from '@/site.config';
import { t } from '@/lib/i18n';

export default function CtaBand({ lang }: { lang: Lang }) {
  const d = t(lang);
  return (
    <section className="cta-band">
      <div className="container cta-inner">
        <div>
          <h2>{d.ctaTitle}</h2>
          <p>{d.ctaText}</p>
        </div>
        <div className="cta-buttons">
          <a className="btn btn-light" href={`tel:${site.business.phone}`}>{d.callNow}</a>
          <a className="btn btn-ghost" href={`https://wa.me/${site.business.whatsapp}`} rel="noopener">{d.whatsapp}</a>
        </div>
      </div>
    </section>
  );
}
