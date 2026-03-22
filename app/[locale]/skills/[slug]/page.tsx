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
  return buildMetadata({
    title: skill.seoTitle ?? skill.name,
    description: skill.seoDescription ?? skill.shortDescription,
    locale,
    path: `/${locale}/skills/${slug}`,
  })
}

export default async function SkillDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const skill = await getSkill(slug, locale as Locale)
  if (!skill) notFound()

  const t = await getTranslations({ locale, namespace: 'skills' })
  const tDetail = await getTranslations({ locale, namespace: 'skills.detail' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tBadges = await getTranslations({ locale, namespace: 'badges' })

  const [relatedTemplates, relatedUseCases] = await Promise.all([
    getRelatedTemplates(skill.compatibleTemplates ?? [], locale as Locale),
    getRelatedUseCases(skill.useCases ?? [], locale as Locale),
  ])

  const statusVariant = skill.status === 'stable' ? 'stable' : skill.status === 'beta' ? 'beta' : 'draft'
  const complexityMap = {
    L1: tBadges('L1'),
    L2: tBadges('L2'),
    L3: tBadges('L3'),
  }
  const statusLabel = tCommon(skill.status as Parameters<typeof tCommon>[0])

  return (
    <>
      <section className="bg-slate-900 py-14">
        <div className="container-site">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-slate-300">{tDetail('home')}</Link>
            <span>/</span>
            <Link href="/skills" className="hover:text-slate-300">{tDetail('skills')}</Link>
            <span>/</span>
            <span className="text-slate-200">{skill.name}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={statusVariant}>{statusLabel}</Badge>
              <Badge variant={skill.complexity as 'L1' | 'L2' | 'L3'}>{complexityMap[skill.complexity]}</Badge>
              <span className="text-xs text-slate-400 font-mono self-center">v{skill.version}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white">{skill.name}</h1>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">{skill.shortDescription}</p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {skill.doneForYouAvailable && (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  {tDetail('doneForYou')}
                </span>
              )}
              {skill.requiresHumanApproval && (
                <span className="flex items-center gap-1.5 text-amber-400">
                  <UserCheck className="h-4 w-4" />
                  {tDetail('requiresApproval')}
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
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">{tDetail('inputsTitle')}</h2>
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
                <h2 className="text-lg font-bold text-slate-900 mb-3">{tDetail('outputsTitle')}</h2>
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

            {skill.prerequisites.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">{tDetail('prerequisitesTitle')}</h2>
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

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                {tDetail('limitationsTitle')}
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

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">{tDetail('changelogTitle')}</h2>
              <p className="text-sm text-slate-500">{skill.changelogSummary}</p>
            </section>

            {skill.documentationSnippet && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">{tDetail('documentationTitle')}</h2>
                <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-x-auto">
                  {skill.documentationSnippet}
                </pre>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-3">{tDetail('detailsTitle')}</h3>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">{tDetail('typeLabel')}</dt>
                  <dd className="font-medium text-slate-900 capitalize">{skill.capabilityType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">{tDetail('complexityLabel')}</dt>
                  <dd className="font-medium text-slate-900">{complexityMap[skill.complexity]}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">{tDetail('sensitivityLabel')}</dt>
                  <dd className="font-medium text-slate-900 capitalize">{skill.dataSensitivityLevel}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">{tDetail('statusLabel')}</dt>
                  <dd>
                    <Badge variant={statusVariant} className="text-xs">{statusLabel}</Badge>
                  </dd>
                </div>
              </dl>
              <Button asChild size="default" className="w-full mt-5">
                <Link href={`/contact?skill=${skill.slug}`}>{t('implement')}</Link>
              </Button>
            </div>

            <RelatedContent templates={relatedTemplates} useCases={relatedUseCases} />
          </div>
        </div>
      </div>

      <CtaSection
        title={tDetail('ctaTitle')}
        subtitle={tDetail('ctaSubtitle')}
        primaryCta={t('implement')}
        primaryHref={`/contact?skill=${skill.slug}`}
        secondaryCta={tDetail('browseCta')}
        secondaryHref="/skills"
      />
    </>
  )
}
