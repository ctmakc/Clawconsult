import { getTranslations } from 'next-intl/server'
import { getResources } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { ResourceCard } from '@/components/cards/ResourceCard'
import type { Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'resources' })
  return buildMetadata({ title: t('title'), description: t('subtitle'), locale, path: `/${locale}/resources` })
}

export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'resources' })

  const resources = await getResources(locale as Locale)

  return (
    <>
      <section className="bg-slate-900 py-14">
        <div className="container-site">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('title')}</h1>
          <p className="mt-3 text-slate-400 max-w-2xl">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-site">
          {resources.length === 0 ? (
            <p className="text-slate-500 text-center py-12">No articles published yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((r) => (
                <ResourceCard key={r.slug} resource={r} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
