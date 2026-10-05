import type { Metadata } from 'next';
import { defaultLang, site } from '@/site.config';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.business.name[defaultLang],
  alternates: { canonical: `${site.url}/${defaultLang}/` },
  robots: { index: false, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={defaultLang} dir="rtl">
      <head>
        {/* Static hosting fallback; vercel.json also sends a 301 from / to /ar/ */}
        <meta httpEquiv="refresh" content={`0; url=/${defaultLang}/`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
