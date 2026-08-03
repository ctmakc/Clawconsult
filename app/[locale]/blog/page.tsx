import { getTranslations } from 'next-intl/server'
import { getResources } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { ResourceCard } from '@/components/cards/ResourceCard'
import type { Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return buildMetadata({
    title: 'Blog — AI Customer Service & Email Automation',
    description:
      'Practical guides on AI email automation, customer service workflows, knowledge bases, and reducing support costs for small businesses.',
    locale,
    path: `/${locale}/blog`,
  })
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params
  const resources = await getResources(locale as Locale)

  // Filter to blog-type categories
  const blogCategories = ['how-to', 'strategy', 'case-study', 'anti-pattern']
  const blogPosts = resources.filter((r) => blogCategories.includes(r.category))

  return (
    <>
      <section className="bg-slate-900 py-14">
        <div className="container-site">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            AI Customer Service Blog
          </h1>
          <p className="mt-3 text-slate-400 max-w-2xl">
            Practical guides on AI email automation, customer service workflows, knowledge bases,
            and how to reduce support costs for small businesses.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-site">
          {blogPosts.length === 0 ? (
            <p className="text-slate-500 text-center py-12">No posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((r) => (
                <ResourceCard key={r.slug} resource={r} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
