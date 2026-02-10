import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from '@/components/seo/GoogleAnalytics';
import GoogleSearchConsole from '@/components/seo/GoogleSearchConsole';
import StructuredData from '@/components/seo/StructuredData';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IkazeProperty.rw - Buy & Sell Property, Cars & Land in Rwanda | Kigali Marketplace",
  description: "Rwanda's trusted marketplace for real estate, vehicles, and land. Buy, sell, and rent properties in Kigali and across Rwanda. Secure transactions with admin mediation. Best prices for houses, apartments, cars, and commercial land.",
  keywords: "Rwanda property, Kigali real estate, buy house Rwanda, sell car Rwanda, land for sale Rwanda, Rwanda marketplace, property Kigali, real estate Rwanda, buy land Kigali, sell property Rwanda, Rwanda cars, apartments Kigali, commercial property Rwanda",
  authors: [{ name: "IkazeProperty.rw" }],
  creator: "IkazeProperty.rw",
  publisher: "IkazeProperty.rw",
  metadataBase: new URL('https://ikazeproperty.rw'),
  alternates: {
    canonical: '/',
    languages: {
      'en-RW': '/en',
      'rw-RW': '/rw',
      'fr-RW': '/fr'
    }
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/ikazeproperty-logo.svg',
  },
  openGraph: {
    title: "IkazeProperty.rw - Rwanda's Premier Property & Vehicle Marketplace",
    description: "Buy, sell, and rent properties, cars, and land across Rwanda. Trusted marketplace with secure transactions. Find your dream home or vehicle in Kigali and beyond.",
    url: 'https://ikazeproperty.rw',
    siteName: 'IkazeProperty.rw',
    locale: 'en_RW',
    type: 'website',
    images: [
      {
        url: '/images/ikazeproperty-logo.svg',
        width: 1200,
        height: 630,
        alt: 'Ikaze Property - Rwanda Premier Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "IkazeProperty.rw - Rwanda's Trusted Marketplace",
    description: "Buy, sell, and rent properties, cars, and land in Rwanda. Secure transactions with admin-mediated connections.",
    images: ['/images/ikazeproperty-logo.svg'],
    creator: '@ikazeproperty',
    site: '@ikazeproperty'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-RW" suppressHydrationWarning={true}>
      <head>
        <GoogleSearchConsole verificationCode="your-google-verification-code" />
        <link rel="alternate" hrefLang="en" href="https://ikazeproperty.rw/en" />
        <link rel="alternate" hrefLang="rw" href="https://ikazeproperty.rw/rw" />
        <link rel="alternate" hrefLang="fr" href="https://ikazeproperty.rw/fr" />
        <link rel="alternate" hrefLang="x-default" href="https://ikazeproperty.rw" />
        
        {/* Structured Data for Local Business */}
        <StructuredData 
          type="LocalBusiness"
          data={{
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://ikazeproperty.rw",
            "name": "IkazeProperty.rw",
            "description": "Rwanda's trusted marketplace for real estate, vehicles, and land. Buy, sell, and rent properties in Kigali and across Rwanda.",
            "url": "https://ikazeproperty.rw",
            "telephone": "+250-788-123-456",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "RW",
              "addressLocality": "Kigali",
              "addressRegion": "Kigali City",
              "postalCode": "0000"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "-1.9441",
              "longitude": "30.0619"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Rwanda"
            },
            "openingHours": "Mo-Su 00:00-23:59",
            "priceRange": "$$",
            "sameAs": [
              "https://www.facebook.com/ikazeproperty",
              "https://www.twitter.com/ikazeproperty",
              "https://www.instagram.com/ikazeproperty"
            ],
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "RWF",
              "lowPrice": "10000",
              "highPrice": "50000000",
              "offerCount": "4678"
            }
          }}
        />
        
        {/* Website Schema */}
        <StructuredData 
          type="WebSite"
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://ikazeproperty.rw#website",
            "url": "https://ikazeproperty.rw",
            "name": "IkazeProperty.rw",
            "description": "Rwanda's premier online marketplace for property, vehicles, and land",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://ikazeproperty.rw/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }}
        />
      </head>
      <body 
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
        {children}
      </body>
    </html>
  );
}
