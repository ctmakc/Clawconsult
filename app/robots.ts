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
      // Allow AI training and search bots explicitly
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'GoogleExtended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: getSiteOrigin(),
  }
}
