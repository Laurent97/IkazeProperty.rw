'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  measurementId: string
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  // Only render if we have a real measurement ID (not the placeholder)
  if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
              content_group1: 'Rwanda Property Marketplace',
              custom_map: {
                'custom_parameter_1': 'region',
                'custom_parameter_2': 'city',
                'custom_parameter_3': 'category'
              }
            });
            
            // Track Rwanda-specific events
            gtag('event', 'page_view', {
              country: 'Rwanda',
              region: 'East Africa'
            });
          `,
        }}
      />
    </>
  )
}
