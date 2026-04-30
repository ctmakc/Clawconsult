import type { MetadataRoute } from 'next'
import { absoluteUrl, getSiteOrigin } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/en/thank-you', '/ru/thank-you', '/fr/thank-you'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: getSiteOrigin(),
  }
}
