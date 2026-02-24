import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { Analytics } from '@/components/layout/Analytics'

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://openclaw.ca'),
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
