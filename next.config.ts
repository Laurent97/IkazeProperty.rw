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
    const isDev = process.env.NODE_ENV === 'development';
    
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              `script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules' 'unsafe-inline'${isDev ? ' \'unsafe-eval\'' : ''} chrome-extension://72a0033f-e71b-4b5d-a0c7-35099a3f03cc/ https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com;`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "img-src 'self' data: https: blob:;",
              "font-src 'self' data: https://fonts.gstatic.com;",
              "connect-src 'self' https://api.supabase.co https://supabase.com https://swshkufpktnacbotddpb.supabase.co https://*.supabase.co https://*.supabase.in https://vercel.live https://www.google-analytics.com;",
              "frame-src 'self' https://vercel.live;",
              "default-src 'self';"
            ].join(' ')
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
