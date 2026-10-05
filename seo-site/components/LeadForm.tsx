import { site, type Lang } from '@/site.config';
import { t } from '@/lib/i18n';

/** Plain HTML form (no JavaScript) so pages stay fully static and fast. */
export default function LeadForm({ lang, defaultCity, source }: { lang: Lang; defaultCity?: string; source: string }) {
  const d = t(lang);
  const b = site.business;
  return (
    <div className="lead-card" id="quote">
      <h2 className="lead-title">{d.formTitle}</h2>
      {site.leadFormEndpoint ? (
        <form action={site.leadFormEndpoint} method="POST" className="lead-form">
          <input type="hidden" name="source" value={source} />
          <label>
            {d.formName}
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            {d.formPhone}
            <input name="phone" type="tel" required autoComplete="tel" dir="ltr" />
          </label>
          <label>
            {d.formCity}
            <select name="city" defaultValue={defaultCity}>
              {site.cities.map((c) => (
                <option key={c.key} value={c.key}>{c.name[lang]}</option>
              ))}
            </select>
          </label>
          <label>
            {d.formMessage}
            <textarea name="message" rows={3} />
          </label>
          <button type="submit" className="btn btn-block">{d.formSubmit}</button>
        </form>
      ) : (
        <div className="lead-actions">
          <a className="btn btn-block" href={`tel:${b.phone}`}>{d.callNow}</a>
          <a className="btn btn-outline btn-block" href={`https://wa.me/${b.whatsapp}`} rel="noopener">{d.whatsapp}</a>
        </div>
      )}
      <p className="lead-note">{d.formNote}</p>
    </div>
  );
}
