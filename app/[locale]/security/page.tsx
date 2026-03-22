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

export default async function SecurityPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'security' })

  const principleIcons = [Lock, Shield, UserCheck, Eye, AlertTriangle, BookOpen] as const
  const principles = (t.raw('principles') as Array<{ title: string; desc: string }>).map((item, i) => ({
    ...item,
    icon: principleIcons[i] ?? Shield,
  }))
  const reviewItems = t.raw('precheck.reviewItems') as string[]
  const faqs = t.raw('faqs') as Array<{ question: string; answer: string }>

  return (
    <>
      <section className="bg-slate-900 py-16 sm:py-20">
        <div className="container-site">
          <Badge variant="outline" className="mb-4 border-emerald-400/40 text-emerald-300 bg-transparent">
            <Shield className="h-3.5 w-3.5 mr-1" />
            {t('badge')}
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

      <section className="py-16 bg-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('principlesTitle')}</h2>
            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">{t('principlesSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map(({ icon: Icon, title, desc }) => (
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

      <section className="py-14 bg-slate-800">
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{t('precheck.title')}</h2>
            <p className="mt-3 text-slate-300 leading-relaxed">{t('precheck.body')}</p>
            <p className="mt-2 text-slate-400 text-sm">{t('precheck.priceLine')}</p>
            <Button asChild size="lg" className="mt-5">
              <Link href="/contact?service=security-pre-check">{t('precheck.cta')}</Link>
            </Button>
          </div>
          <ul className="space-y-3">
            {reviewItems.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container-site max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900">{t('quarterly.title')}</h2>
          <p className="mt-4 text-slate-500 leading-relaxed">{t('quarterly.body')}</p>
          <p className="mt-4 text-sm text-slate-400">{t('quarterly.priceLine')}</p>
          <Button asChild size="lg" className="mt-5" variant="outline">
            <Link href="/contact?service=quarterly-security-review">{t('quarterly.cta')}</Link>
          </Button>
        </div>
      </section>

      <FaqSection title={t('faqTitle')} faqs={faqs} />

      <CtaSection
        title={t('finalCta.title')}
        subtitle={t('finalCta.subtitle')}
        primaryCta={t('finalCta.primary')}
        primaryHref="/contact?service=security-pre-check"
        secondaryCta={t('finalCta.secondary')}
        secondaryHref="/services"
      />
    </>
  )
}
