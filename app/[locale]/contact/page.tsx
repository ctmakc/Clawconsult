import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { CheckCircle2, Clock, Globe, Shield } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { ContactForm } from '@/components/forms/ContactForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    locale,
    path: `/${locale}/contact`,
    noIndex: false,
  })
}

const TRUST_ITEMS = [
  { icon: Clock, text: 'Response within 1 business day' },
  { icon: Shield, text: 'No commitment required' },
  { icon: Globe, text: 'Remote worldwide · Onsite Ottawa' },
  { icon: CheckCircle2, text: '60-minute structured session' },
]

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 py-12">
        <div className="container-site">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('title')}</h1>
          <p className="mt-3 text-slate-400 max-w-2xl">{t('subtitle')}</p>

          <div className="mt-6 flex flex-wrap gap-4">
            {TRUST_ITEMS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-slate-300">
                <Icon className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="container-site max-w-3xl">
          <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 rounded-xl" />}>
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
