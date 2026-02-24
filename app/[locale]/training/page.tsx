import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Users, Monitor, MapPin, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FaqSection } from '@/components/sections/FaqSection'
import { CtaSection } from '@/components/sections/CtaSection'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'training' })
  return buildMetadata({ title: t('title'), description: t('subtitle'), locale, path: `/${locale}/training` })
}

const WORKSHOP_FORMATS = [
  {
    icon: Monitor,
    title: 'Remote Live Workshop',
    desc: 'Interactive video session with your team. Screen sharing, hands-on exercises, Q&A throughout.',
    duration: '3–6 hours',
    participants: 'Up to 10',
    price: 'From CAD 900',
  },
  {
    icon: MapPin,
    title: 'Onsite Ottawa Workshop',
    desc: 'Full-day in-person training at your Ottawa location. Best for teams who benefit from face-to-face learning.',
    duration: 'Full day (6–7 hrs)',
    participants: 'Up to 15',
    price: 'From CAD 1,500',
  },
  {
    icon: Users,
    title: 'Team Enablement Training',
    desc: 'Structured enablement session — hands-on with your actual deployed agents and workflows.',
    duration: '1 day',
    participants: 'Your team',
    price: 'CAD 1,500',
  },
]

const TOPICS = [
  'What AI agents can and cannot reliably do',
  'How to interact with deployed agents safely',
  'Understanding human approval points',
  'Recognizing and reporting anomalous behavior',
  'Data hygiene when working with agents',
  'How to interpret agent outputs and logs',
  'When to escalate vs. trust agent output',
  'Security best practices for end users',
]

const TRAINING_FAQS = [
  {
    question: 'Do participants need technical backgrounds?',
    answer: 'No. Team Enablement Training is designed for non-technical staff who will work alongside agents. We adjust depth and language to your team.',
  },
  {
    question: 'Can training be customized to our specific agents?',
    answer: 'Yes — we always tailor content to your actual deployed workflows, not generic examples. This is the most effective approach.',
  },
  {
    question: 'Is training available in French?',
    answer: 'We can deliver sessions in English or French. Contact us to discuss.',
  },
  {
    question: 'Can we record the training?',
    answer: 'Yes, for internal use. We will provide the session recording and any supporting materials.',
  },
]

export default async function TrainingPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'training' })

  return (
    <>
      <section className="bg-slate-900 py-14">
        <div className="container-site">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('title')}</h1>
          <p className="mt-3 text-slate-400 max-w-2xl">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container-site">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Workshop Formats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {WORKSHOP_FORMATS.map(({ icon: Icon, title, desc, duration, participants, price }) => (
              <div key={title} className="rounded-xl border border-slate-200 p-6 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="p-2.5 rounded-lg bg-blue-50 w-fit mb-3">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{desc}</p>
                <dl className="space-y-1 text-xs text-slate-400 mb-4">
                  <div className="flex gap-1.5"><Clock className="h-3.5 w-3.5" /><span>{duration}</span></div>
                  <div className="flex gap-1.5"><Users className="h-3.5 w-3.5" /><span>{participants}</span></div>
                </dl>
                <p className="text-sm font-bold text-slate-900">{price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-slate-50">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What We Cover</h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Training content is always customized to your team and your deployed agents.
                These are the core topics we address in every session.
              </p>
              <Button asChild size="lg">
                <Link href="/contact?service=team-enablement-training">Book Training</Link>
              </Button>
            </div>
            <ul className="grid grid-cols-1 gap-2.5">
              {TOPICS.map((topic) => (
                <li key={topic} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FaqSection title="Training FAQ" faqs={TRAINING_FAQS} />

      <CtaSection
        title="Ready to Train Your Team?"
        subtitle="Book a training session tailored to your agents and your team's needs."
        primaryCta="Book Training Session"
        primaryHref="/contact?service=team-enablement-training"
        secondaryCta="View Team Enablement Service"
        secondaryHref="/services/team-enablement-training"
      />
    </>
  )
}
