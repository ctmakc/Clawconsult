import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { Analytics } from '@/components/layout/Analytics'
import { getSiteOrigin, absoluteUrl } from '@/lib/utils'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OpenClaw Consulting',
  alternateName: 'ClawHelp',
  url: 'https://clawhlp.com',
  logo: absoluteUrl('/images/logo.png'),
  description:
    'AI agent implementation consulting for SMB and professional services. Ottawa + remote worldwide.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ottawa',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'hello@clawhlp.com',
  },
  sameAs: [],
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ClawHelp',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'AI-powered customer service email automation. Incoming emails → AI draft → Telegram approval → auto-send.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free trial available',
  },
  url: 'https://clawhlp.com',
  provider: {
    '@type': 'Organization',
    name: 'OpenClaw Consulting',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: {
    default: 'OpenClaw Consulting — AI Agent Implementation Canada',
    template: '%s | OpenClaw Consulting',
  },
  description:
    'Production-ready autonomous AI agent implementation for SMB and professional services. Ottawa onsite + remote worldwide.',
  metadataBase: new URL(getSiteOrigin()),
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'ru' | 'fr')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <div lang={locale} className="min-h-screen flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <NextIntlClientProvider messages={messages}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </NextIntlClientProvider>
      <Analytics />
    </div>
  )
}
