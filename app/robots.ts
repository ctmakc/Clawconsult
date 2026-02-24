import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/thank-you'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://openclaw.ca',
  }
}
