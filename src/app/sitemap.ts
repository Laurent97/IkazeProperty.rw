import { MetadataRoute } from 'next'
import generateSitemap from '@/lib/sitemap-generator'

export default function sitemap(): MetadataRoute.Sitemap {
  return generateSitemap()
}
