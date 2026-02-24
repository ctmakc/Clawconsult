import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getUseCases } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { UseCaseCard } from '@/components/cards/UseCaseCard'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string>> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'useCases' })
  return buildMetadata({ title: t('title'), description: t('subtitle'), locale, path: `/${locale}/use-cases` })
}

const FUNCTION_FILTERS = [
  { value: 'all', labelKey: 'filterAll' },
  { value: 'founder', labelKey: 'filterFounder' },
  { value: 'sales', labelKey: 'filterSales' },
  { value: 'ops', labelKey: 'filterOps' },
  { value: 'marketing', labelKey: 'filterMarketing' },
  { value: 'recruiting', labelKey: 'filterRecruiting' },
  { value: 'finance-admin', labelKey: 'filterFinance' },
] as const

export default async function UseCasesPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations({ locale, namespace: 'useCases' })

  const category = sp.category ?? 'all'
  const q = (sp.q ?? '').toLowerCase()

  let useCases = await getUseCases(locale as Locale)

  if (category !== 'all') {
    useCases = useCases.filter((u) => u.functionCategory === category)
  }
  if (q) {
    useCases = useCases.filter(
      (u) => u.title.toLowerCase().includes(q) || u.summary.toLowerCase().includes(q)
    )
  }

  return (
    <>
      <section className="bg-slate-900 py-14">
        <div className="container-site">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('title')}</h1>
          <p className="mt-3 text-slate-400 max-w-2xl">{t('subtitle')}</p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-4 sticky top-16 z-30">
        <div className="container-site">
          <div className="flex flex-wrap gap-2">
            {FUNCTION_FILTERS.map((f) => (
              <Link
                key={f.value}
                href={f.value === 'all' ? '/use-cases' : `/use-cases?category=${f.value}`}
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

      <section className="py-12">
        <div className="container-site">
          {useCases.length === 0 ? (
            <p className="text-slate-500 text-center py-12">{t('noResults')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {useCases.map((uc) => <UseCaseCard key={uc.slug} useCase={uc} />)}
            </div>
          )}
        </div>
      </section>

      <section className="py-10 bg-slate-50 border-t border-slate-200">
        <div className="container-site text-center">
          <h2 className="text-xl font-bold text-slate-900">{t('customCta.title')}</h2>
          <p className="mt-2 text-slate-500">{t('customCta.subtitle')}</p>
          <Button asChild size="lg" className="mt-5">
            <Link href="/contact">{t('customCta.cta')}</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
