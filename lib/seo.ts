import type { Metadata } from 'next'
import { absoluteUrl } from './utils'

const siteName = 'OpenClaw Consulting'
const defaultDescription =
  'We deploy production-ready autonomous AI agents for SMB and professional services — securely, incrementally, with measurable business outcomes. Ottawa + remote worldwide.'

interface SeoProps {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
  locale?: string
  path?: string
}

export function buildMetadata({
  title,
  description = defaultDescription,
  image,
  noIndex = false,
  locale = 'en',
  path = '',
}: SeoProps): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — AI Agent Consulting Canada`
  const url = absoluteUrl(path)
  const ogImage = image ?? absoluteUrl('/images/og-default.png')

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://openclaw.ca'),
    alternates: {
      canonical: url,
      languages: {
        en: absoluteUrl(path.replace(/^\/(en|ru|fr)/, '/en')),
        ru: absoluteUrl(path.replace(/^\/(en|ru|fr)/, '/ru')),
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      locale: locale === 'ru' ? 'ru_RU' : 'en_CA',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}

// Schema.org helpers
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OpenClaw Consulting',
    url: absoluteUrl('/'),
    logo: absoluteUrl('/images/logo.png'),
    description: defaultDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ottawa',
      addressRegion: 'ON',
      addressCountry: 'CA',
    },
    areaServed: ['CA', 'US', 'GB', 'AU'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@openclaw.ca',
    },
    sameAs: [],
  }
}

export function serviceSchema(service: { title: string; shortDescription: string; pricingFrom: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.shortDescription,
    provider: {
      '@type': 'Organization',
      name: 'OpenClaw Consulting',
      url: absoluteUrl('/'),
    },
    offers: {
      '@type': 'Offer',
      price: service.pricingFrom,
      priceCurrency: 'CAD',
    },
  }
}

export function articleSchema(article: {
  title: string
  excerpt: string
  publishDate: string
  updatedDate?: string
  slug: string
  locale: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishDate,
    dateModified: article.updatedDate ?? article.publishDate,
    url: absoluteUrl(`/${article.locale}/resources/${article.slug}`),
    publisher: {
      '@type': 'Organization',
      name: 'OpenClaw Consulting',
      logo: { '@type': 'ImageObject', url: absoluteUrl('/images/logo.png') },
    },
  }
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
