import { getResources } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { ResourceCard } from '@/components/cards/ResourceCard'
import type { Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return buildMetadata({
    title: 'AI Tool Comparisons — ClawHelp vs Zendesk, Freshdesk & More',
    description:
      'Honest comparisons between ClawHelp and other customer service tools. Find out which email automation solution fits your small business.',
    locale,
    path: `/${locale}/compare`,
  })
}

export default async function CompareIndexPage({ params }: Props) {
  const { locale } = await params
  const resources = await getResources(locale as Locale)
  const comparisons = resources.filter((r) => r.category === 'comparison')

  return (
    <>
      <section className="bg-slate-900 py-14">
        <div className="container-site">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Tool Comparisons
          </h1>
          <p className="mt-3 text-slate-400 max-w-2xl">
            Honest comparisons to help you choose the right customer service automation tool
            for your business.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-site">
          {comparisons.length === 0 ? (
            <p className="text-slate-500 text-center py-12">No comparisons published yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparisons.map((r) => (
                <ResourceCard key={r.slug} resource={r} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
