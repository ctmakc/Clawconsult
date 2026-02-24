import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  ArrowRight, Shield, Zap, Search, Settings, HeadphonesIcon,
  BookOpen, CheckCircle2, Globe, Building2, Briefcase, Store
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ServiceCard } from '@/components/cards/ServiceCard'
import { UseCaseCard } from '@/components/cards/UseCaseCard'
import { SkillCard } from '@/components/cards/SkillCard'
import { TemplateCard } from '@/components/cards/TemplateCard'
import { CtaSection } from '@/components/sections/CtaSection'
import { buildMetadata, organizationSchema } from '@/lib/seo'
import {
  getFeaturedServices,
  getFeaturedUseCases,
  getFeaturedSkills,
  getTemplates,
} from '@/lib/content'
import type { Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.hero' })
  return buildMetadata({
    title: t('title'),
    description: t('subtitle'),
    locale,
    path: `/${locale}`,
  })
}

// ── Section components (server) ───────────────────────────────────────────────

function HeroSection() {
  const t = useTranslations('home.hero')
  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-28 lg:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-700 blur-3xl" />
      </div>

      <div className="container-site relative z-10">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-4 border-blue-400/40 text-blue-300 bg-transparent">
            <Globe className="h-3.5 w-3.5 mr-1" />
            {t('badge')}
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t('title')}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            {t('subtitle')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button asChild size="xl">
              <Link href="/contact">
                {t('cta1')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline-white">
              <Link href="/use-cases">{t('cta2')}</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-slate-400">{t('trust')}</p>
        </div>
      </div>
    </section>
  )
}

const WHAT_WE_DO_ITEMS = [
  { icon: Search, key: 'strategy', color: 'text-purple-400', bg: 'bg-purple-900/30', href: '/services?category=strategy', label: 'Strategy & Audit' },
  { icon: Settings, key: 'setup', color: 'text-blue-400', bg: 'bg-blue-900/30', href: '/services?category=setup', label: 'Setup & Foundation' },
  { icon: Shield, key: 'security', color: 'text-emerald-400', bg: 'bg-emerald-900/30', href: '/security', label: 'Security & Governance' },
  { icon: Zap, key: 'build', color: 'text-amber-400', bg: 'bg-amber-900/30', href: '/services?category=build', label: 'Agent Build' },
  { icon: HeadphonesIcon, key: 'support', color: 'text-rose-400', bg: 'bg-rose-900/30', href: '/services?category=support', label: 'Managed Support' },
]

function WhatWeDoSection() {
  const t = useTranslations('home.whatWeDo')
  return (
    <section className="py-16 bg-slate-800">
      <div className="container-site">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('title')}</h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {WHAT_WE_DO_ITEMS.map(({ icon: Icon, label, color, bg, href }) => (
            <Link
              key={href}
              href={href as Parameters<typeof Link>[0]['href']}
              className="flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors text-center group"
            >
              <div className={`p-3 rounded-lg ${bg}`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

const FOR_WHOM_ITEMS = [
  { icon: Briefcase, label: 'Professional Services', desc: 'Lawyers, accountants, consultants, recruiters', color: 'bg-purple-50 border-purple-100' },
  { icon: Zap, label: 'Agencies & Consultants', desc: 'Marketing, digital, creative, advisory', color: 'bg-blue-50 border-blue-100' },
  { icon: Store, label: 'Local SMB', desc: 'Owner-operated businesses, service providers', color: 'bg-emerald-50 border-emerald-100' },
  { icon: Building2, label: 'Franchises & Multi-unit', desc: 'Standardization, reporting, quality control', color: 'bg-amber-50 border-amber-100' },
]

function ForWhomSection() {
  const t = useTranslations('home.forWhom')
  return (
    <section className="py-16 bg-white">
      <div className="container-site">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FOR_WHOM_ITEMS.map(({ icon: Icon, label, desc, color }) => (
            <div key={label} className={`flex flex-col gap-3 p-6 rounded-xl border ${color}`}>
              <div className="p-2.5 rounded-lg bg-white w-fit shadow-sm">
                <Icon className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{label}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const HOW_IT_WORKS_STEPS = [
  { n: '01', title: 'Discovery', desc: 'We map your workflows, pain points, and automation opportunities in a focused session.' },
  { n: '02', title: 'Design', desc: 'We design the agent architecture — scope, skills, integrations, approval gates.' },
  { n: '03', title: 'Build', desc: 'We build and configure agents in a sandbox environment with full documentation.' },
  { n: '04', title: 'Test & Secure', desc: 'Security review, human approval points, access scoping, and edge case testing.' },
  { n: '05', title: 'Handover', desc: 'You receive a fully documented, production-ready system your team can operate.' },
  { n: '06', title: 'Support', desc: 'Optional managed support, monitoring, and quarterly security reviews.' },
]

function HowItWorksSection() {
  const t = useTranslations('home.howItWorks')
  return (
    <section className="py-16 bg-slate-50">
      <div className="container-site">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('title')}</h2>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div key={step.n} className="relative flex gap-4">
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                {step.n}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SecurityTeaserSection() {
  const t = useTranslations('home.securityTeaser')
  const POINTS = [
    'Secret & credential isolation',
    'Minimal permission scoping',
    'Human approval gates',
    'Full audit trail',
    'Sandbox vs production separation',
    'Incident response playbook',
  ]
  return (
    <section className="py-16 bg-slate-900">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <Badge variant="outline" className="mb-4 border-emerald-400/40 text-emerald-300 bg-transparent">
              <Shield className="h-3.5 w-3.5 mr-1" />
              Security First
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{t('title')}</h2>
            <p className="mt-4 text-slate-400 leading-relaxed">{t('subtitle')}</p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/security">{t('cta')}</Link>
            </Button>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3 bg-slate-800 rounded-lg px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-slate-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const tHome = await getTranslations({ locale, namespace: 'home' })

  const [featuredServices, featuredUseCases, featuredSkills, templates] = await Promise.all([
    getFeaturedServices(locale as Locale),
    getFeaturedUseCases(locale as Locale),
    getFeaturedSkills(locale as Locale),
    getTemplates(locale as Locale),
  ])

  const schemaOrg = organizationSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <HeroSection />
      <WhatWeDoSection />
      <ForWhomSection />

      {/* Featured Use Cases */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {tHome('whatYouCanAutomate.title')}
              </h2>
              <p className="mt-2 text-slate-500 max-w-2xl">
                {tHome('whatYouCanAutomate.subtitle')}
              </p>
            </div>
            <Link
              href="/use-cases"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 shrink-0"
            >
              {tHome('whatYouCanAutomate.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredUseCases.slice(0, 6).map((uc) => (
              <UseCaseCard key={uc.slug} useCase={uc} />
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link href="/use-cases">{tHome('whatYouCanAutomate.viewAll')}</Link>
            </Button>
          </div>
        </div>
      </section>

      <HowItWorksSection />

      {/* Featured Services */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {tHome('featuredOffers.title')}
              </h2>
              <p className="mt-2 text-slate-500 max-w-2xl">
                {tHome('featuredOffers.subtitle')}
              </p>
            </div>
            <Link
              href="/services"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 shrink-0"
            >
              {tHome('featuredOffers.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredServices.slice(0, 6).map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Templates preview */}
      <section className="py-16 bg-slate-50">
        <div className="container-site">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {tHome('libraryPreview.title')}
            </h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              {tHome('libraryPreview.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Skills */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  Skills Library
                </h3>
                <Link href="/skills" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  {tHome('libraryPreview.viewSkills')} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredSkills.slice(0, 4).map((skill) => (
                  <SkillCard key={skill.slug} skill={skill} compact />
                ))}
              </div>
            </div>

            {/* Templates */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Agent Blueprints
                </h3>
                <Link href="/templates" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  {tHome('libraryPreview.viewTemplates')} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {templates.slice(0, 3).map((template) => (
                  <TemplateCard key={template.slug} template={template} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SecurityTeaserSection />

      <CtaSection
        title={tHome('finalCta.title')}
        subtitle={tHome('finalCta.subtitle')}
        primaryCta={tHome('finalCta.cta')}
        primaryHref="/contact"
        dark={false}
      />
    </>
  )
}
