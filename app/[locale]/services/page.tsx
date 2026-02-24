import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { getServices } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { CtaSection } from '@/components/sections/CtaSection'
import type { Locale } from '@/i18n/routing'
import type { Service } from '@/types/domain'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string>> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })
  return buildMetadata({ title: t('title'), description: t('subtitle'), locale, path: `/${locale}/services` })
}

const CATEGORY_FILTERS = [
  { value: 'all', labelKey: 'filterAll' },
  { value: 'strategy', labelKey: 'filterStrategy' },
  { value: 'setup', labelKey: 'filterSetup' },
  { value: 'security', labelKey: 'filterSecurity' },
  { value: 'build', labelKey: 'filterBuild' },
  { value: 'support', labelKey: 'filterSupport' },
  { value: 'training', labelKey: 'filterTraining' },
  { value: 'onsite', labelKey: 'filterOnsite' },
] as const

function ServiceGrid({ services }: { services: Service[] }) {
  const t = useTranslations('services')
  if (!services.length) {
    return <p className="text-slate-500 py-12 text-center">{t('noResults')}</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((s) => <ServiceCard key={s.slug} service={s} />)}
    </div>
  )
}

export default async function ServicesPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations({ locale, namespace: 'services' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const category = sp.category ?? 'all'
  const q = (sp.q ?? '').toLowerCase()

  let services = await getServices(locale as Locale)

  if (category !== 'all') {
    services = services.filter((s) => s.category === category)
  }
  if (q) {
    services = services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q)
    )
  }

  return (
    <>
      {/* Header */}
      <section className="bg-slate-900 py-14 sm:py-16">
        <div className="container-site">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('title')}</h1>
          <p className="mt-3 text-slate-400 max-w-2xl">{t('subtitle')}</p>
        </div>
      </section>

      {/* Filters (client component) */}
      <section className="border-b border-slate-200 bg-white py-4 sticky top-16 z-30">
        <div className="container-site">
          <div className="flex flex-wrap items-center gap-3">
            {CATEGORY_FILTERS.map((f) => (
              <Link
                key={f.value}
                href={f.value === 'all' ? '/services' : `/services?category=${f.value}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === f.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t(f.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12">
        <div className="container-site">
          <Suspense fallback={<p className="text-slate-500">{tCommon('loading')}</p>}>
            <ServiceGrid services={services} />
          </Suspense>
        </div>
      </section>

      {/* CTA helper */}
      <section className="py-10 bg-slate-50 border-t border-slate-200">
        <div className="container-site text-center">
          <h2 className="text-xl font-bold text-slate-900">{t('chooseHelp.title')}</h2>
          <p className="mt-2 text-slate-500">{t('chooseHelp.subtitle')}</p>
          <Button asChild size="lg" className="mt-5">
            <Link href="/contact">{t('chooseHelp.cta')}</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
