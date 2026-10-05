import { site } from '@/site.config';

// Plain script tags marked data-keep: they survive scripts/strip-js.mjs, which removes the Next.js runtime.
export default function Analytics() {
  if (!site.gaId) return null;
  return (
    <>
      <script data-keep async src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} />
      <script
        data-keep
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.gaId}');`,
        }}
      />
    </>
  );
}
