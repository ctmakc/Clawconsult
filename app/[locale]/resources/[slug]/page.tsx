import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Clock, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { RelatedContent } from '@/components/sections/RelatedContent'
import { CtaSection } from '@/components/sections/CtaSection'
import { buildMetadata, articleSchema, breadcrumbSchema } from '@/lib/seo'
import { absoluteUrl, formatDate } from '@/lib/utils'
import { getResource, getResources, getRelatedServices, getRelatedUseCases } from '@/lib/content'
import type { Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const resources = await getResources('en')
  return resources.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const resource = await getResource(slug, locale as Locale)
  if (!resource) return {}
  return buildMetadata({
    title: resource.seoTitle ?? resource.title,
    description: resource.seoDescription ?? resource.excerpt,
    locale,
    path: `/${locale}/resources/${slug}`,
  })
}

export default async function ResourceDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const resource = await getResource(slug, locale as Locale)
  if (!resource) notFound()

  const t = await getTranslations({ locale, namespace: 'resources' })
  const tArticle = await getTranslations({ locale, namespace: 'resources.article' })

  const [relatedServices, relatedUseCases] = await Promise.all([
    getRelatedServices(resource.relatedServices ?? [], locale as Locale),
    getRelatedUseCases(resource.relatedUseCases ?? [], locale as Locale),
  ])

  const schemas = [
    articleSchema({ ...resource, locale }),
    breadcrumbSchema([
      { name: tArticle('home'), url: absoluteUrl(`/${locale}`) },
      { name: tArticle('resources'), url: absoluteUrl(`/${locale}/resources`) },
      { name: resource.title, url: absoluteUrl(`/${locale}/resources/${slug}`) },
    ]),
  ]

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <section className="bg-slate-900 py-14">
        <div className="container-site max-w-3xl">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-slate-300">{tArticle('home')}</Link>
            <span>/</span>
            <Link href="/resources" className="hover:text-slate-300">{tArticle('resources')}</Link>
            <span>/</span>
            <span className="text-slate-200 line-clamp-1">{resource.title}</span>
          </nav>

          <Badge variant="category" className="mb-4">
            {t(`categories.${resource.category}` as Parameters<typeof t>[0])}
          </Badge>

          <h1 className="text-3xl sm:text-4xl font-bold text-white">{resource.title}</h1>
          <p className="mt-4 text-lg text-slate-300 leading-relaxed">{resource.excerpt}</p>

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(resource.publishDate, locale)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {resource.readTime} {t('minRead')}
            </span>
            <span>{resource.author}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {resource.tags.map((tag) => (
              <span key={tag} className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="container-site py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2 prose prose-slate max-w-none">
            {resource.content ? (
              <div className="whitespace-pre-wrap leading-relaxed text-slate-700">{resource.content}</div>
            ) : (
              <>
                <p className="text-slate-600 leading-relaxed">{resource.excerpt}</p>
                <p className="text-slate-500 italic mt-6 text-sm">{tArticle('contentSoon')}</p>
              </>
            )}
          </article>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-3">{tArticle('aboutTitle')}</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">{tArticle('published')}</dt>
                  <dd className="text-slate-900">{formatDate(resource.publishDate, locale)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">{tArticle('readTime')}</dt>
                  <dd className="text-slate-900">{resource.readTime} {t('minRead')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">{tArticle('author')}</dt>
                  <dd className="text-slate-900">{resource.author}</dd>
                </div>
              </dl>
            </div>

            <RelatedContent services={relatedServices} useCases={relatedUseCases} />
          </div>
        </div>
      </div>

      <CtaSection
        title={tArticle('ctaTitle')}
        subtitle={tArticle('ctaSubtitle')}
        primaryCta={tArticle('ctaPrimary')}
        primaryHref="/contact"
        secondaryCta={tArticle('ctaSecondary')}
        secondaryHref="/resources"
      />
    </>
  )
}
