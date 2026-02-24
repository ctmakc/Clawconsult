import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { CheckCircle2, Clock, Layers, ArrowRight, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RelatedContent } from '@/components/sections/RelatedContent'
import { CtaSection } from '@/components/sections/CtaSection'
import { buildMetadata } from '@/lib/seo'
import { getTemplate, getTemplates, getRelatedServices, getRelatedUseCases, getRelatedSkills } from '@/lib/content'
import type { Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const templates = await getTemplates('en')
  return templates.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const template = await getTemplate(slug, locale as Locale)
  if (!template) return {}
  return buildMetadata({ title: template.seoTitle, description: template.seoDescription, locale, path: `/${locale}/templates/${slug}` })
}

export default async function TemplateDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const template = await getTemplate(slug, locale as Locale)
  if (!template) notFound()

  const t = await getTranslations({ locale, namespace: 'templates' })

  const skillSlugs = template.includedSkills.map((s) => s.skillSlug)
  const [relatedServices, relatedUseCases, includedSkills] = await Promise.all([
    getRelatedServices(template.relatedServices ?? [], locale as Locale),
    getRelatedUseCases(template.relatedUseCases ?? [], locale as Locale),
    getRelatedSkills(skillSlugs, locale as Locale),
  ])

  const complexityLabel = { low: 'Low', medium: 'Medium', high: 'High' }

  return (
    <>
      <section className="bg-slate-900 py-14">
        <div className="container-site">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-slate-300">Home</Link>
            <span>/</span>
            <Link href="/templates" className="hover:text-slate-300">Templates</Link>
            <span>/</span>
            <span className="text-slate-200">{template.title}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={template.complexity === 'low' ? 'L1' : template.complexity === 'medium' ? 'L2' : 'L3'}>
                {complexityLabel[template.complexity]} Complexity
              </Badge>
              <span className="text-xs text-slate-400 font-mono self-center">v{template.version}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white">{template.title}</h1>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">{template.summary}</p>

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {template.timeline}
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> {template.includedSkills.length} skills
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-white">
                From {template.pricingFrom}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/contact?template=${template.slug}`}>{t('deployThis')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline-white">
                <Link href="/templates">All Blueprints</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-site py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Goals */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Goals</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {template.goals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-3 bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{goal}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Workflow Stages */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-5">Workflow Stages</h2>
              <ol className="space-y-5">
                {template.workflowStages.map((stage, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{stage.stage}</h3>
                      <p className="text-sm text-slate-500 mt-1">{stage.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Included Skills */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Included Skills</h2>
              <div className="space-y-3">
                {template.includedSkills.map((item) => {
                  const skill = includedSkills.find((s) => s.slug === item.skillSlug)
                  return (
                    <div key={item.skillSlug} className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 bg-white">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                        {item.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-slate-900">
                            {skill?.name ?? item.skillSlug}
                          </span>
                          {skill && (
                            <Badge variant={skill.status === 'stable' ? 'stable' : 'beta'} className="text-xs">
                              {skill.status}
                            </Badge>
                          )}
                        </div>
                        {item.note && <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>}
                      </div>
                      <Link
                        href={`/skills/${item.skillSlug}`}
                        className="text-xs text-blue-600 hover:text-blue-700 shrink-0"
                      >
                        View <ArrowRight className="inline h-3 w-3" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Deliverables */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Deliverables</h2>
              <ul className="space-y-2">
                {template.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <ArrowRight className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </section>

            {/* Guardrails */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                Guardrails & Governance
              </h2>
              <ul className="space-y-2">
                {template.guardrails.map((g, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {g}
                  </li>
                ))}
              </ul>
            </section>

            {/* Success Metrics */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Success Metrics</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {template.successMetrics.map((metric, i) => (
                  <li key={i} className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 text-center text-sm font-medium text-slate-700">
                    {metric}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Blueprint Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Complexity</dt>
                  <dd className="font-medium text-slate-900 capitalize">{template.complexity}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Timeline</dt>
                  <dd className="font-medium text-slate-900">{template.timeline}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Skills</dt>
                  <dd className="font-medium text-slate-900">{template.includedSkills.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Starting From</dt>
                  <dd className="font-bold text-slate-900">{template.pricingFrom}</dd>
                </div>
              </dl>

              <div className="mt-4 space-y-1 text-xs text-slate-500">
                <p className="font-medium text-slate-600">Built for:</p>
                {template.targetAudience.map((a) => (
                  <p key={a}>{a}</p>
                ))}
              </div>

              <Button asChild size="default" className="w-full mt-5">
                <Link href={`/contact?template=${template.slug}`}>{t('deployThis')}</Link>
              </Button>
            </div>

            <RelatedContent
              services={relatedServices}
              useCases={relatedUseCases}
            />
          </div>
        </div>
      </div>

      <CtaSection
        title="Ready to Deploy This Blueprint?"
        subtitle={`Get started in ${template.timeline}. We handle setup, configuration, and handover.`}
        primaryCta={t('deployThis')}
        primaryHref={`/contact?template=${template.slug}`}
        secondaryCta="Browse All Blueprints"
        secondaryHref="/templates"
      />
    </>
  )
}
