import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { MapPin, Globe, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CtaSection } from '@/components/sections/CtaSection'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return buildMetadata({ title: t('title'), description: t('subtitle'), locale, path: `/${locale}/about` })
}

const VALUES = [
  { icon: Shield, title: 'Security Before Convenience', desc: 'We will not sacrifice safety for speed. Every agent ships with documented guardrails, scoped permissions, and human approval gates.' },
  { icon: Zap, title: 'Incremental, Not All-At-Once', desc: 'We start with one workflow, validate it, then expand. No big-bang transformations that create fragile dependencies.' },
  { icon: Globe, title: 'Remote-First, Onsite When It Matters', desc: 'Most of our work happens remotely. When physical presence adds real value — setup days, team trainings — we come to you.' },
  { icon: MapPin, title: 'Honest Scoping', desc: 'We tell you what we can and cannot do with agents. If automation is not the right solution, we say so.' },
]

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <>
      <section className="bg-slate-900 py-16 sm:py-20">
        <div className="container-site max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('title')}</h1>
          <p className="mt-4 text-lg text-slate-300 leading-relaxed">{t('subtitle')}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-14 bg-white">
        <div className="container-site max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Why OpenClaw Exists</h2>
          <div className="prose prose-slate max-w-none space-y-4 text-slate-600 leading-relaxed">
            <p>
              We founded OpenClaw after watching too many small businesses get burned by AI promises that never materialized.
              Vendors selling &ldquo;automation&rdquo; that needed constant human babysitting. Consultants building expensive demos
              that broke the moment something changed.
            </p>
            <p>
              The OpenClaw approach is different: we deploy agents that are <strong>boring</strong> in the best possible sense.
              Agents that run reliably, handle errors gracefully, ask for human input when they should, and don&apos;t do
              things they weren&apos;t designed to do.
            </p>
            <p>
              We specialize in the <strong>OpenClaw framework</strong> — a structured approach to building, documenting,
              and governing autonomous AI agents for business use. Everything we deploy is versioned, auditable, and
              operable by your team without us.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 bg-slate-50">
        <div className="container-site">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">What We Believe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-14 bg-white">
        <div className="container-site max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Based in Ottawa, Available Worldwide</h2>
          <p className="text-slate-500 leading-relaxed">
            OpenClaw Consulting is headquartered in Ottawa, Ontario. We serve clients across Canada, the United States,
            and internationally — fully remotely. For clients in the Ottawa region, we offer onsite setup days,
            team trainings, and in-person workshops.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span>Ottawa, ON, Canada · hello@openclaw.ca</span>
          </div>
        </div>
      </section>

      <CtaSection
        title="Want to Work With Us?"
        subtitle="Start with a 60-minute Discovery Session — no commitment required."
        primaryCta="Book Discovery Session"
        primaryHref="/contact"
        secondaryCta="View Our Services"
        secondaryHref="/services"
      />
    </>
  )
}
