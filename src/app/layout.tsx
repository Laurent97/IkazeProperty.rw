import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IkazeProperty.rw - Rwanda's Trusted Marketplace",
  description: "Buy, sell, and rent properties, cars, land, and more in Rwanda. Secure transactions with admin-mediated connections and 30% commission.",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/ikazeproperty-logo.svg',
  },
  openGraph: {
    title: "IkazeProperty.rw - Rwanda's Trusted Marketplace",
    description: "Buy, sell, and rent properties, cars, land, and more in Rwanda. Secure transactions with admin-mediated connections and 30% commission.",
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
    description: "Buy, sell, and rent properties, cars, land, and more in Rwanda. Secure transactions with admin-mediated connections and 30% commission.",
    images: ['/images/ikazeproperty-logo.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning={true}>
      <body 
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
