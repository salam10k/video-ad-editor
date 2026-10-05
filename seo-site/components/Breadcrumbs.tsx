import Link from 'next/link';

export default function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="breadcrumbs">
      <ol>
        {items.map((it, i) => (
          <li key={it.path}>
            {i < items.length - 1 ? <Link href={it.path}>{it.name}</Link> : <span aria-current="page">{it.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
