import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CtaSection } from '@/components/sections/CtaSection'
import { FaqSection } from '@/components/sections/FaqSection'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pricing' })
  return buildMetadata({ title: t('title'), description: t('subtitle'), locale, path: `/${locale}/pricing` })
}

const PRICING_TIERS = [
  {
    group: 'entry',
    label: 'Entry & Discovery',
    items: [
      { name: 'Workflow Discovery Session', price: 'CAD 600', duration: 'Half-day', slug: 'workflow-discovery', model: 'Fixed' },
      { name: 'AI & Agent Readiness Audit', price: 'CAD 1,200', duration: '1–2 days', slug: 'ai-readiness-audit', model: 'Fixed' },
      { name: 'Security Pre-Check', price: 'CAD 800', duration: '1 day', slug: 'security-pre-check', model: 'Fixed' },
      { name: 'Team Enablement Training', price: 'CAD 1,500', duration: '1 day', slug: 'team-enablement-training', model: 'Fixed' },
    ],
  },
  {
    group: 'build',
    label: 'Foundation & Build',
    items: [
      { name: 'OpenClaw Foundation Setup', price: 'CAD 2,400', duration: '2–3 days', slug: 'openclaw-foundation-setup', model: 'Fixed' },
      { name: 'Setup + Security Baseline Bundle', price: 'CAD 3,200', duration: '3–4 days', slug: 'setup-security-baseline', model: 'Fixed', highlight: true },
      { name: 'Founder Agent Stack Setup', price: 'CAD 3,800', duration: '1 week', slug: 'founder-agent-stack', model: 'Fixed' },
      { name: 'Onsite Ottawa Setup Day', price: 'CAD 2,200', duration: '1 day onsite', slug: 'onsite-ottawa-setup-day', model: 'Fixed' },
      { name: 'First Agent Launch', price: 'From CAD 4,500', duration: '1–2 weeks', slug: 'first-agent-launch', model: 'Range' },
      { name: 'Agent Workflow Sprint', price: 'From CAD 6,000', duration: '2–3 weeks', slug: 'agent-workflow-sprint', model: 'Range' },
    ],
  },
  {
    group: 'retainers',
    label: 'Ongoing & Retainers',
    items: [
      { name: 'Quarterly Agent Security Review', price: 'CAD 900/quarter', duration: 'Half-day', slug: 'quarterly-security-review', model: 'Fixed' },
      { name: 'Managed AgentOps (Monthly)', price: 'CAD 2,800/mo', duration: 'Ongoing', slug: 'managed-agentops', model: 'Retainer', highlight: true },
    ],
  },
]

const PRICING_FAQS = [
  {
    question: 'Are the prices fixed or can they vary?',
    answer: 'Most services have fixed prices scoped in advance. "Range" means the price depends on workflow complexity determined during discovery. We never add costs without your approval.',
  },
  {
    question: 'Do you offer discounts for multiple services?',
    answer: 'Yes — the Setup + Security Baseline Bundle saves CAD 400 vs. buying separately. For larger projects combining multiple services, contact us for a bundled quote.',
  },
  {
    question: 'Is travel included in the Onsite Ottawa service?',
    answer: 'The Onsite Ottawa Setup Day covers an 8-hour session at your Ottawa-area location. Travel within the Ottawa region is included. For travel outside Ottawa, contact us for a quote.',
  },
  {
    question: 'What currency are prices in?',
    answer: 'All prices are in Canadian dollars (CAD). We can invoice in USD for international clients — contact us for rates.',
  },
  {
    question: 'Is there a minimum engagement?',
    answer: 'No. You can start with a Workflow Discovery Session at CAD 600 to explore automation opportunities with no commitment to further services.',
  },
]

export default async function PricingPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pricing' })

  return (
    <>
      <section className="bg-slate-900 py-14">
        <div className="container-site">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('title')}</h1>
          <p className="mt-3 text-slate-400 max-w-2xl">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container-site space-y-14">
          {PRICING_TIERS.map((tier) => (
            <div key={tier.group}>
              <h2 className="text-xl font-bold text-slate-900 mb-6">{tier.label}</h2>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-5 py-3 text-slate-600 font-medium">Service</th>
                      <th className="text-left px-5 py-3 text-slate-600 font-medium hidden sm:table-cell">Duration</th>
                      <th className="text-left px-5 py-3 text-slate-600 font-medium hidden md:table-cell">Model</th>
                      <th className="text-right px-5 py-3 text-slate-600 font-medium">Price</th>
                      <th className="px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tier.items.map((item) => (
                      <tr key={item.slug} className={item.highlight ? 'bg-blue-50' : 'hover:bg-slate-50'}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">{item.name}</span>
                            {item.highlight && <Badge variant="default" className="text-xs">Popular</Badge>}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-500 hidden sm:table-cell">{item.duration}</td>
                        <td className="px-5 py-4 text-slate-500 hidden md:table-cell">{item.model}</td>
                        <td className="px-5 py-4 text-right font-semibold text-slate-900">{item.price}</td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/services/${item.slug}`}
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs whitespace-nowrap"
                          >
                            Details <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom quote */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="container-site max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold text-slate-900">{t('custom')}</h2>
          <p className="mt-2 text-slate-500">
            Complex multi-agent environments, enterprise security requirements, or multi-phase rollouts may require
            a custom scoping session.
          </p>
          <Button asChild size="lg" className="mt-5">
            <Link href="/contact">{t('cta')}</Link>
          </Button>
        </div>
      </section>

      <FaqSection title="Pricing FAQ" faqs={PRICING_FAQS} />

      <CtaSection
        title="Ready to Get Started?"
        subtitle="Book a Discovery Session first — then we'll recommend the right service for your situation."
        primaryCta="Book Discovery Session"
        primaryHref="/contact"
        secondaryCta="View All Services"
        secondaryHref="/services"
      />
    </>
  )
}
