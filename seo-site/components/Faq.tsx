import type { Faq as FaqItem } from '@/lib/content';

export default function Faq({ items, title }: { items: FaqItem[]; title: string }) {
  if (!items.length) return null;
  return (
    <section className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">{title}</h2>
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </section>
  );
}
