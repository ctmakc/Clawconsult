import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { AlertTriangle, CheckCircle2, UserCheck, Shield, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RelatedContent } from '@/components/sections/RelatedContent'
import { CtaSection } from '@/components/sections/CtaSection'
import { buildMetadata, breadcrumbSchema } from '@/lib/seo'
import { absoluteUrl } from '@/lib/utils'
import { getUseCase, getUseCases, getRelatedServices, getRelatedSkills, getRelatedTemplates } from '@/lib/content'
import type { Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const useCases = await getUseCases('en')
  return useCases.map((u) => ({ slug: u.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const uc = await getUseCase(slug, locale as Locale)
  if (!uc) return {}
  return buildMetadata({ title: uc.seoTitle, description: uc.seoDescription, locale, path: `/${locale}/use-cases/${slug}` })
}

const COMPLEXITY_BADGE = { low: 'L1', medium: 'L2', high: 'L3' } as const

export default async function UseCaseDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const uc = await getUseCase(slug, locale as Locale)
  if (!uc) notFound()

  const t = await getTranslations({ locale, namespace: 'useCases' })

  const [relatedServices, relatedSkills, relatedTemplates] = await Promise.all([
    getRelatedServices(uc.recommendedServices ?? [], locale as Locale),
    getRelatedSkills(uc.recommendedSkills ?? [], locale as Locale),
    getRelatedTemplates(uc.recommendedTemplates ?? [], locale as Locale),
  ])

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: absoluteUrl(`/${locale}`) },
    { name: 'Use Cases', url: absoluteUrl(`/${locale}/use-cases`) },
    { name: uc.title, url: absoluteUrl(`/${locale}/use-cases/${slug}`) },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero */}
      <section className="bg-slate-900 py-14">
        <div className="container-site">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-slate-300">Home</Link>
            <span>/</span>
            <Link href="/use-cases" className="hover:text-slate-300">Use Cases</Link>
            <span>/</span>
            <span className="text-slate-200">{uc.title}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="category">
                {uc.functionCategory.charAt(0).toUpperCase() + uc.functionCategory.slice(1)}
              </Badge>
              <Badge variant={COMPLEXITY_BADGE[uc.implementationComplexity]}>
                {uc.implementationComplexity.charAt(0).toUpperCase() + uc.implementationComplexity.slice(1)} Complexity
              </Badge>
              {uc.featured && <Badge variant="default">Featured</Badge>}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white">{uc.title}</h1>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">{uc.summary}</p>

            <div className="mt-5 text-sm text-slate-400">
              <span className="font-medium text-slate-300">Role: </span>{uc.rolePersona}
              <span className="mx-3">·</span>
              <span className="font-medium text-slate-300">Timeline: </span>{uc.timelineEstimate}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/contact?usecase=${uc.slug}`}>{t('discussWorkflow')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline-white">
                <Link href="/use-cases">All Use Cases</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-site py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Pain Points */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Pain Points This Solves</h2>
              <ul className="space-y-3">
                {uc.painPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 bg-red-50 rounded-lg p-4 border border-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{p}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Solution */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">How It Works</h2>
              <p className="text-slate-600 leading-relaxed">{uc.solutionConcept}</p>
            </section>

            {/* Workflow */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-5">Typical Workflow</h2>
              <ol className="space-y-4">
                {uc.typicalWorkflow.map((step) => (
                  <li key={step.step} className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </div>
                    <div className="flex items-center text-sm text-slate-700">{step.action}</div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Impact */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Expected Impact</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {uc.expectedImpact.map((impact, i) => (
                  <li key={i} className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 text-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
                    <span className="text-sm font-medium text-slate-700">{impact}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Governance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-500" />
                  Human Approval Points
                </h2>
                <ul className="space-y-2">
                  {uc.humanApprovalPoints.map((p, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-300 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  Security Notes
                </h2>
                <ul className="space-y-2">
                  {uc.securityNotes.map((n, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-300 flex-shrink-0" />
                      {n}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Quick Facts</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Complexity</dt>
                  <dd className="font-medium text-slate-900 capitalize">{uc.implementationComplexity}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Timeline</dt>
                  <dd className="font-medium text-slate-900">{uc.timelineEstimate}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Function</dt>
                  <dd className="font-medium text-slate-900 capitalize">{uc.functionCategory}</dd>
                </div>
              </dl>
              <Button asChild size="default" className="w-full mt-4">
                <Link href={`/contact?usecase=${uc.slug}`}>{t('discussWorkflow')}</Link>
              </Button>
            </div>

            <RelatedContent
              services={relatedServices}
              skills={relatedSkills}
              templates={relatedTemplates}
            />
          </div>
        </div>
      </div>

      <CtaSection
        title="Ready to Implement This Workflow?"
        subtitle="We'll design and build it for your specific business context."
        primaryCta={t('discussWorkflow')}
        primaryHref={`/contact?usecase=${uc.slug}`}
        secondaryCta="Browse All Use Cases"
        secondaryHref="/use-cases"
      />
    </>
  )
}
