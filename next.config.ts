import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    localPatterns: [
      {
        pathname: '/api/placeholder',
        search: '?width=*&height=*',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules' 'unsafe-inline' chrome-extension://72a0033f-e71b-4b5d-a0c7-35099a3f03cc/;",
              "style-src 'self' 'unsafe-inline';",
              "img-src 'self' data: https: blob:;",
              "font-src 'self' data:;",
              "connect-src 'self' https://api.supabase.co https://supabase.com;",
              "default-src 'self';"
            ].join(' ')
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
