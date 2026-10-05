import { site, type Lang } from '@/site.config';

export default function Stats({ lang }: { lang: Lang }) {
  return (
    <ul className="stats">
      {site.business.stats.map((s) => (
        <li key={s.value}>
          <strong dir="ltr">{s.value}</strong>
          <span>{s.label[lang]}</span>
        </li>
      ))}
    </ul>
  );
}
