import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/utils'
import { getServices, getUseCases, getSkills, getTemplates, getResources } from '@/lib/content'

const LOCALES = ['en', 'ru'] as const
const STATIC_PAGES = [
  '',
  '/services',
  '/use-cases',
  '/skills',
  '/templates',
  '/security',
  '/pricing',
  '/training',
  '/about',
  '/resources',
  '/contact',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  for (const page of STATIC_PAGES) {
    entries.push({
      url: absoluteUrl(`/en${page}`),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, absoluteUrl(`/${l}${page}`)])
        ),
      },
      changeFrequency: page === '' ? 'weekly' : 'monthly',
      priority: page === '' ? 1.0 : 0.8,
    })
  }

  // Dynamic pages — using EN as canonical
  const [services, useCases, skills, templates, resources] = await Promise.all([
    getServices('en'),
    getUseCases('en'),
    getSkills('en'),
    getTemplates('en'),
    getResources('en'),
  ])

  for (const s of services) {
    entries.push({
      url: absoluteUrl(`/en/services/${s.slug}`),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(`/${l}/services/${s.slug}`)])),
      },
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const u of useCases) {
    entries.push({
      url: absoluteUrl(`/en/use-cases/${u.slug}`),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(`/${l}/use-cases/${u.slug}`)])),
      },
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const sk of skills) {
    entries.push({
      url: absoluteUrl(`/en/skills/${sk.slug}`),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(`/${l}/skills/${sk.slug}`)])),
      },
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  for (const tmpl of templates) {
    entries.push({
      url: absoluteUrl(`/en/templates/${tmpl.slug}`),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(`/${l}/templates/${tmpl.slug}`)])),
      },
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const r of resources) {
    entries.push({
      url: absoluteUrl(`/en/resources/${r.slug}`),
      lastModified: new Date(r.publishDate),
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(`/${l}/resources/${r.slug}`)])),
      },
      changeFrequency: 'yearly',
      priority: 0.6,
    })
  }

  return entries
}
