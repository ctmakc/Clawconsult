import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { CalendarDays, Clock, Globe, Shield, CheckCircle2 } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { ContactForm } from '@/components/forms/ContactForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'bookDiscoveryPage' })

  return buildMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    locale,
    path: `/${locale}/book-discovery`,
  })
}

export default async function BookDiscoveryPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'bookDiscoveryPage' })

  const expectData = t.raw('expect') as Array<{ title: string; desc: string }>
  const expectItems = [
    { icon: CalendarDays, ...expectData[0] },
    { icon: Globe, ...expectData[1] },
    { icon: Clock, ...expectData[2] },
    { icon: Shield, ...expectData[3] },
  ]
  const agenda = t.raw('agenda') as Array<{ time: string; activity: string }>
  const afterItems = t.raw('afterItems') as string[]

  return (
    <div className="min-h-screen">
      <section className="bg-slate-900 py-12 sm:py-16">
        <div className="container-site max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('title')}</h1>
          <p className="mt-3 text-slate-300 text-lg max-w-2xl leading-relaxed">{t('subtitle')}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {expectItems.map(({ icon: Icon, title, desc }) => (
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

      <section className="py-12">
        <div className="container-site max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <aside className="lg:col-span-2">
              <div className="sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-5">{t('agendaTitle')}</h2>
                <ol className="space-y-4">
                  {agenda.map(({ time, activity }, i) => (
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
                  <h3 className="text-sm font-semibold text-emerald-900 mb-2">{t('afterTitle')}</h3>
                  <ul className="space-y-1.5">
                    {afterItems.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <h2 className="text-lg font-bold text-slate-900 mb-6">{t('formTitle')}</h2>
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
