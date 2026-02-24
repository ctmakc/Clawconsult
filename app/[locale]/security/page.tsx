import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Shield, Lock, UserCheck, Eye, AlertTriangle, BookOpen, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FaqSection } from '@/components/sections/FaqSection'
import { CtaSection } from '@/components/sections/CtaSection'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'security' })
  return buildMetadata({ title: t('title'), description: t('subtitle'), locale, path: `/${locale}/security` })
}

const PRINCIPLES = [
  {
    icon: Lock,
    title: 'Secrets & Credential Isolation',
    desc: 'API keys and credentials are never embedded in agent configs. We use environment-level secret management and per-agent isolation to prevent cross-contamination.',
  },
  {
    icon: Shield,
    title: 'Minimal Permission Scoping',
    desc: 'Each agent receives only the permissions required for its specific task — no broad read/write access. We follow the principle of least privilege throughout.',
  },
  {
    icon: UserCheck,
    title: 'Human Approval Gates',
    desc: 'High-stakes actions (sending emails, modifying records, financial operations) require explicit human confirmation before execution, regardless of automation level.',
  },
  {
    icon: Eye,
    title: 'Full Audit Trail',
    desc: 'Every agent action, decision point, and data access is logged. You can review exactly what your agents did, when, and why.',
  },
  {
    icon: AlertTriangle,
    title: 'Sandbox vs. Production Separation',
    desc: 'All agents are built and tested in isolated sandbox environments. We never test with production data or live credentials.',
  },
  {
    icon: BookOpen,
    title: 'Incident Response Playbook',
    desc: 'Every deployment includes a documented incident response plan: how to detect anomalous behavior, pause agents, and recover.',
  },
]

const WHAT_WE_REVIEW = [
  'Agent credential storage and rotation practices',
  'Permission scoping for each agent and integration',
  'Data flows and sensitive data handling',
  'Human approval gate placement',
  'Logging and audit trail completeness',
  'Sandbox/production environment separation',
  'Third-party integration security posture',
  'Incident response readiness',
]

const SECURITY_FAQS = [
  {
    question: 'Do agents have access to all my business data?',
    answer: 'No. Agents only access the specific data sources and scopes required for their task. We explicitly configure and document each permission during setup.',
  },
  {
    question: 'What happens if an agent makes a mistake or acts unexpectedly?',
    answer: 'We define approval gates for high-risk actions and implement circuit breakers. The incident response playbook we deliver covers how to pause, roll back, or terminate agents immediately.',
  },
  {
    question: 'Is my data sent to third-party AI models?',
    answer: "We document exactly which data passes through which AI services during design. For sensitive workloads, we can architect solutions that minimize or eliminate external data transmission.",
  },
  {
    question: "What's the Security Pre-Check service?",
    answer: 'A one-day review that assesses your current setup (or planned setup) against our security baseline. You receive a written report with prioritized findings and remediation steps.',
  },
  {
    question: 'Do you offer ongoing security monitoring?',
    answer: 'Yes — our Quarterly Agent Security Review retainer includes regular audits, changelog reviews for any agent framework updates, and updated threat modeling.',
  },
]

export default async function SecurityPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'security' })

  return (
    <>
      {/* Hero */}
      <section className="bg-slate-900 py-16 sm:py-20">
        <div className="container-site">
          <Badge variant="outline" className="mb-4 border-emerald-400/40 text-emerald-300 bg-transparent">
            <Shield className="h-3.5 w-3.5 mr-1" />
            Security & Governance
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-3xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl leading-relaxed">{t('subtitle')}</p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/contact?service=security-pre-check">{t('cta')}</Link>
          </Button>
        </div>
      </section>

      {/* Our principles */}
      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Security Principles</h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              Every agent we deploy follows these non-negotiable standards — regardless of project size or budget.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRINCIPLES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-50">
                    <Icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Pre-Check CTA band */}
      <section className="py-14 bg-slate-800">
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Security Pre-Check Service</h2>
            <p className="mt-3 text-slate-300 leading-relaxed">
              Before you deploy any agents — or if you already have agents running — our Security Pre-Check gives you
              a full written assessment with prioritized findings and remediation steps.
            </p>
            <p className="mt-2 text-slate-400 text-sm">
              From <span className="font-bold text-white">CAD 800</span> · 1 day · Remote or Onsite Ottawa
            </p>
            <Button asChild size="lg" className="mt-5">
              <Link href="/contact?service=security-pre-check">Book Security Pre-Check</Link>
            </Button>
          </div>
          <ul className="space-y-3">
            {WHAT_WE_REVIEW.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quarterly review */}
      <section className="py-14 bg-white">
        <div className="container-site max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900">Quarterly Agent Security Reviews</h2>
          <p className="mt-4 text-slate-500 leading-relaxed">
            Agent frameworks evolve fast. New versions introduce new attack surfaces. Our quarterly review retainer
            keeps your deployed agents secure over time — with updated threat modeling, changelog review, and
            permission re-auditing every three months.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            From <span className="font-bold text-slate-900">CAD 900/quarter</span>
          </p>
          <Button asChild size="lg" className="mt-5" variant="outline">
            <Link href="/contact?service=quarterly-security-review">Enquire About Quarterly Reviews</Link>
          </Button>
        </div>
      </section>

      <FaqSection title="Security FAQ" faqs={SECURITY_FAQS} />

      <CtaSection
        title="Not Sure How Secure Your Agents Are?"
        subtitle="Start with a Security Pre-Check and get clear, written findings in one day."
        primaryCta="Book Security Pre-Check"
        primaryHref="/contact?service=security-pre-check"
        secondaryCta="View All Services"
        secondaryHref="/services"
      />
    </>
  )
}
