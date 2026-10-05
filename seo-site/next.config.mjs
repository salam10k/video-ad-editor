/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static Site Generation is mandatory (see CLAUDE.md): every page is pre-built HTML.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  // Inline the CSS in each page: no render-blocking stylesheet request.
  experimental: { inlineCss: true },
};

export default nextConfig;
