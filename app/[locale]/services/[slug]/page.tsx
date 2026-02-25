import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FaqSection } from '@/components/sections/FaqSection'
import { RelatedContent } from '@/components/sections/RelatedContent'
import { CtaSection } from '@/components/sections/CtaSection'
import { buildMetadata, serviceSchema, breadcrumbSchema } from '@/lib/seo'
import { absoluteUrl } from '@/lib/utils'
import { getService, getServices, getRelatedSkills, getRelatedTemplates, getRelatedUseCases } from '@/lib/content'
import type { Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const services = await getServices('en')
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const service = await getService(slug, locale as Locale)
  if (!service) return {}
  return buildMetadata({
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.shortDescription,
    locale,
    path: `/${locale}/services/${slug}`,
  })
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const service = await getService(slug, locale as Locale)
  if (!service) notFound()

  const t = await getTranslations({ locale, namespace: 'services' })
  const tDetail = await getTranslations({ locale, namespace: 'services.detail' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const [relatedSkills, relatedTemplates, relatedUseCases] = await Promise.all([
    getRelatedSkills(service.relatedSkills ?? [], locale as Locale),
    getRelatedTemplates(service.relatedTemplates ?? [], locale as Locale),
    getRelatedUseCases(service.relatedUseCases ?? [], locale as Locale),
  ])

  const schemas = [
    serviceSchema(service),
    breadcrumbSchema([
      { name: tDetail('home'), url: absoluteUrl(`/${locale}`) },
      { name: tDetail('services'), url: absoluteUrl(`/${locale}/services`) },
      { name: service.title, url: absoluteUrl(`/${locale}/services/${slug}`) },
    ]),
  ]

  const formatLabel: Record<string, string> = {
    remote: tCommon('remote'),
    'onsite-ottawa': tCommon('onsite'),
    hybrid: tCommon('hybrid'),
    async: tCommon('async'),
  }

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <section className="bg-slate-900 py-14">
        <div className="container-site">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
            <Link href="/" className="hover:text-slate-300">{tDetail('home')}</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-slate-300">{tDetail('services')}</Link>
            <span>/</span>
            <span className="text-slate-200">{service.title}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {service.formatOptions.map((f) => (
                <Badge key={f} variant={f === 'onsite-ottawa' ? 'onsite' : f === 'hybrid' ? 'hybrid' : 'remote'}>
                  {formatLabel[f] ?? f}
                </Badge>
              ))}
              {service.featured && <Badge variant="default">{tDetail('featured')}</Badge>}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white">{service.title}</h1>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">{service.shortDescription}</p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {service.durationText}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-white">
                {t('pricingFrom')} {service.pricingFrom}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/contact?service=${service.slug}`}>{service.ctaPrimary}</Link>
              </Button>
              <Button asChild size="lg" variant="outline-white">
                <Link href="/services">{service.ctaSecondary || tDetail('viewAllCta')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-site py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{tDetail('problemTitle')}</h2>
              <p className="text-slate-600 leading-relaxed">{service.problemStatement}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{tDetail('outcomesTitle')}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.outcomes.map((o, i) => (
                  <li key={i} className="flex items-start gap-3 bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{o}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{tDetail('scopeTitle')}</h2>
              <ul className="space-y-2">
                {service.scopeItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-5">{tDetail('processTitle')}</h2>
              <ol className="space-y-5">
                {service.processSteps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{step.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{tDetail('deliverablesTitle')}</h2>
              <ul className="space-y-2">
                {service.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <ArrowRight className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">{tDetail('prerequisitesTitle')}</h2>
                <ul className="space-y-2">
                  {service.prerequisites.map((p, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-3">{tDetail('exclusionsTitle')}</h2>
                <ul className="space-y-2">
                  {service.exclusions.map((e, i) => (
                    <li key={i} className="text-sm text-slate-500 flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-300 flex-shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('pricingFrom')}</div>
              <div className="text-3xl font-bold text-slate-900">{service.pricingFrom}</div>
              <div className="text-xs text-slate-400 mt-1">{service.durationText}</div>

              <div className="mt-4 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {service.formatOptions.map((f) => (
                    <Badge key={f} variant={f === 'onsite-ottawa' ? 'onsite' : f === 'hybrid' ? 'hybrid' : 'remote'}>
                      {formatLabel[f] ?? f}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-medium">{tDetail('forLabel')}: </span>
                  {service.audience.join(', ')}
                </div>
              </div>

              <Button asChild size="lg" className="w-full mt-5">
                <Link href={`/contact?service=${service.slug}`}>{service.ctaPrimary}</Link>
              </Button>
            </div>

            <RelatedContent skills={relatedSkills} templates={relatedTemplates} useCases={relatedUseCases} />
          </div>
        </div>
      </div>

      {service.faq && service.faq.length > 0 && <FaqSection faqs={service.faq} />}

      <CtaSection
        title={service.ctaPrimary}
        subtitle={`${tDetail('ctaSubtitlePrefix')} - ${service.durationText}`}
        primaryCta={service.ctaPrimary}
        primaryHref={`/contact?service=${service.slug}`}
        secondaryCta={tDetail('viewAllCta')}
        secondaryHref="/services"
      />
    </>
  )
}
