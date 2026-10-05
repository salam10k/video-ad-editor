import { languages, site } from '@/site.config';

export default function Root() {
  return (
    <main className="container narrow" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h1>{site.business.name.ar} · {site.business.name.en}</h1>
      <p>
        {languages.map((l) => (
          <a key={l} href={`/${l}/`} style={{ margin: '0 1rem' }}>
            {l === 'ar' ? 'العربية' : 'English'}
          </a>
        ))}
      </p>
    </main>
  );
}
