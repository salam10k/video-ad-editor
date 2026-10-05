import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { languages, site } from '@/site.config';
import { dir, isLang } from '@/lib/i18n';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import '../globals.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  verification: site.googleSiteVerification ? { google: site.googleSiteVerification } : undefined,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: '#0f2a3d', width: 'device-width', initialScale: 1 };

export default async function LangLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} dir={dir(lang)}>
      <body>
        {children}
        <Footer lang={lang} />
        <Analytics />
      </body>
    </html>
  );
}
