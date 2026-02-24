import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { CalendarDays, Clock, Globe, Shield, CheckCircle2 } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { ContactForm } from '@/components/forms/ContactForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return buildMetadata({
    title: 'Book a Discovery Session',
    description:
      'Schedule a structured 60-minute discovery session with our AI consulting team. We map your workflows, identify automation opportunities, and outline a practical next step.',
    locale,
    path: `/${locale}/book-discovery`,
  })
}

const WHAT_TO_EXPECT = [
  {
    icon: CalendarDays,
    title: '60-minute structured session',
    desc: 'We follow a clear framework to make every minute count.',
  },
  {
    icon: Globe,
    title: 'Remote or onsite (Ottawa)',
    desc: 'Video call by default. Onsite available for Ottawa-area clients.',
  },
  {
    icon: Clock,
    title: 'Response within 1 business day',
    desc: "We confirm timing quickly — no long waits.",
  },
  {
    icon: Shield,
    title: 'No commitment required',
    desc: 'The discovery session is separate from any engagement. Zero pressure.',
  },
]

const SESSION_AGENDA = [
  { time: '0–10 min', activity: 'Introductions and context — your business, team, and current tools' },
  { time: '10–25 min', activity: 'Workflow mapping — where time is lost and where automation could help' },
  { time: '25–40 min', activity: 'Opportunity prioritization — highest value, lowest risk automations' },
  { time: '40–55 min', activity: 'Practical next steps — what a pilot could look like and what it would cost' },
  { time: '55–60 min', activity: "Your questions — anything we haven't covered" },
]

export default async function BookDiscoveryPage({ params }: Props) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'contact' })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 py-12 sm:py-16">
        <div className="container-site max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Book a Discovery Session</h1>
          <p className="mt-3 text-slate-300 text-lg max-w-2xl leading-relaxed">
            A focused 60-minute working session where we map your workflows, identify the highest-value
            automation opportunities, and outline a practical path forward.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHAT_TO_EXPECT.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3 bg-slate-800 rounded-xl p-4">
                <Icon className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two columns: agenda + form */}
      <section className="py-12">
        <div className="container-site max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Agenda sidebar */}
            <aside className="lg:col-span-2">
              <div className="sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-5">Session Agenda</h2>
                <ol className="space-y-4">
                  {SESSION_AGENDA.map(({ time, activity }, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-blue-600">{time}</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{activity}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                  <h3 className="text-sm font-semibold text-emerald-900 mb-2">After the session</h3>
                  <ul className="space-y-1.5">
                    {[
                      'Written summary of discussed opportunities',
                      'Rough scope and investment estimate',
                      'Recommended next service (if applicable)',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Tell us about your situation</h2>
              <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100 rounded-xl" />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
