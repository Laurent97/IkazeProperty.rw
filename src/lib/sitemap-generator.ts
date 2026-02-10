import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ikazeproperty.rw'
  const currentDate = new Date()

  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/rw`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/fr`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
  ]

  // Category pages
  const categories = ['houses', 'cars', 'land', 'other']
  const categoryPages = categories.flatMap(category => [
    {
      url: `${baseUrl}/listings/${category}`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/listings/${category}`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rw/listings/${category}`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fr/listings/${category}`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    },
  ])

  // Static pages
  const staticPages = [
    'about', 'how-it-works', 'faq', 'customer-service', 'privacy', 'terms',
    'safety', 'dispute-resolution', 'commission-agreement', 'premium-features',
    'create-listing', 'search', 'featured', 'favorites'
  ]

  const staticPageEntries = staticPages.flatMap(page => [
    {
      url: `${baseUrl}/${page}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/en/${page}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/rw/${page}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/fr/${page}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ])

  // Auth pages (lower priority)
  const authPages = ['login', 'register', 'forgot-password', 'reset-password']
  const authPageEntries = authPages.flatMap(page => [
    {
      url: `${baseUrl}/auth/${page}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/en/auth/${page}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/rw/auth/${page}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/fr/auth/${page}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ])

  return [
    ...mainPages,
    ...categoryPages,
    ...staticPageEntries,
    ...authPageEntries,
  ]
}
