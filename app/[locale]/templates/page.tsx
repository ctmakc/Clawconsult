import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getTemplates } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { TemplateCard } from '@/components/cards/TemplateCard'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string>> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'templates' })
  return buildMetadata({ title: t('title'), description: t('subtitle'), locale, path: `/${locale}/templates` })
}

const COMPLEXITY_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'low', label: 'Low Complexity' },
  { value: 'medium', label: 'Medium Complexity' },
  { value: 'high', label: 'High Complexity' },
]

export default async function TemplatesPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations({ locale, namespace: 'templates' })

  const complexity = sp.complexity ?? 'all'

  let templates = await getTemplates(locale as Locale)
  if (complexity !== 'all') {
    templates = templates.filter((t) => t.complexity === complexity)
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
          <div className="flex gap-2">
            {COMPLEXITY_FILTERS.map((f) => (
              <Link
                key={f.value}
                href={f.value === 'all' ? '/templates' : `/templates?complexity=${f.value}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  complexity === f.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-site">
          {templates.length === 0 ? (
            <p className="text-slate-500 text-center py-12">{t('noResults')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((tmpl) => <TemplateCard key={tmpl.slug} template={tmpl} />)}
            </div>
          )}
        </div>
      </section>

      <section className="py-10 bg-slate-50 border-t border-slate-200">
        <div className="container-site text-center">
          <h2 className="text-xl font-bold text-slate-900">{t('discoveryCta.title')}</h2>
          <Button asChild size="lg" className="mt-5">
            <Link href="/contact">{t('discoveryCta.cta')}</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
