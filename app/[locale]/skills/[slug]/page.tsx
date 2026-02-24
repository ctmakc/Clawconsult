import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ShieldCheck, UserCheck, AlertCircle, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RelatedContent } from '@/components/sections/RelatedContent'
import { CtaSection } from '@/components/sections/CtaSection'
import { buildMetadata } from '@/lib/seo'
import { getSkill, getSkills, getRelatedTemplates, getRelatedUseCases } from '@/lib/content'
import type { Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const skills = await getSkills('en')
  return skills.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const skill = await getSkill(slug, locale as Locale)
  if (!skill) return {}
  return buildMetadata({ title: skill.seoTitle, description: skill.seoDescription, locale, path: `/${locale}/skills/${slug}` })
}

export default async function SkillDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const skill = await getSkill(slug, locale as Locale)
  if (!skill) notFound()

  const t = await getTranslations({ locale, namespace: 'skills' })

  const [relatedTemplates, relatedUseCases] = await Promise.all([
    getRelatedTemplates(skill.compatibleTemplates ?? [], locale as Locale),
    getRelatedUseCases(skill.useCases ?? [], locale as Locale),
  ])

  const statusVariant = skill.status === 'stable' ? 'stable' : skill.status === 'beta' ? 'beta' : 'draft'
  const complexityMap = { L1: 'Beginner', L2: 'Intermediate', L3: 'Advanced' }

  return (
    <>
      <section className="bg-slate-900 py-14">
        <div className="container-site">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-slate-300">Home</Link>
            <span>/</span>
            <Link href="/skills" className="hover:text-slate-300">Skills Library</Link>
            <span>/</span>
            <span className="text-slate-200">{skill.name}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={statusVariant}>{skill.status}</Badge>
              <Badge variant={skill.complexity as 'L1' | 'L2' | 'L3'}>{complexityMap[skill.complexity]}</Badge>
              <span className="text-xs text-slate-400 font-mono self-center">v{skill.version}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white">{skill.name}</h1>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">{skill.shortDescription}</p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {skill.doneForYouAvailable && (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  Done-For-You Available
                </span>
              )}
              {skill.requiresHumanApproval && (
                <span className="flex items-center gap-1.5 text-amber-400">
                  <UserCheck className="h-4 w-4" />
                  Requires Human Approval
                </span>
              )}
            </div>

            <Button asChild size="lg" className="mt-6">
              <Link href={`/contact?skill=${skill.slug}`}>{t('implement')}</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container-site py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>

            {/* Inputs & Outputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">Inputs Required</h2>
                <ul className="space-y-2">
                  {skill.inputs.map((inp, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <ArrowRight className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      {inp}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">Outputs Produced</h2>
                <ul className="space-y-2">
                  {skill.outputs.map((out, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <ArrowRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {out}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Prerequisites */}
            {skill.prerequisites.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">Prerequisites</h2>
                <ul className="space-y-2">
                  {skill.prerequisites.map((p, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Known Limitations */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Known Limitations
              </h2>
              <ul className="space-y-2">
                {skill.knownLimitations.map((lim, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-300 flex-shrink-0" />
                    {lim}
                  </li>
                ))}
              </ul>
            </section>

            {/* Changelog */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Changelog</h2>
              <p className="text-sm text-slate-500">{skill.changelogSummary}</p>
            </section>

            {skill.documentationSnippet && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">Documentation</h2>
                <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-x-auto">
                  {skill.documentationSnippet}
                </pre>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Skill Details</h3>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Type</dt>
                  <dd className="font-medium text-slate-900 capitalize">{skill.capabilityType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Complexity</dt>
                  <dd className="font-medium text-slate-900">{complexityMap[skill.complexity]}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Data Sensitivity</dt>
                  <dd className="font-medium text-slate-900 capitalize">{skill.dataSensitivityLevel}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Status</dt>
                  <dd>
                    <Badge variant={statusVariant} className="text-xs">{skill.status}</Badge>
                  </dd>
                </div>
              </dl>
              <Button asChild size="default" className="w-full mt-5">
                <Link href={`/contact?skill=${skill.slug}`}>{t('implement')}</Link>
              </Button>
            </div>

            <RelatedContent
              templates={relatedTemplates}
              useCases={relatedUseCases}
            />
          </div>
        </div>
      </div>

      <CtaSection
        title="Need This Skill Implemented?"
        subtitle="We handle the setup, configuration, and testing end-to-end."
        primaryCta={t('implement')}
        primaryHref={`/contact?skill=${skill.slug}`}
        secondaryCta="Browse Skills Library"
        secondaryHref="/skills"
      />
    </>
  )
}
