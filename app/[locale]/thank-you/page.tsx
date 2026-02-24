import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return buildMetadata({ title: 'Thank You', noIndex: true, locale, path: `/${locale}/thank-you` })
}

export default async function ThankYouPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'thankYou' })

  const steps = t.raw('steps') as string[]

  return (
    <div className="min-h-[70vh] flex items-center py-16">
      <div className="container-site max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-emerald-100">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
        <p className="mt-3 text-slate-500 leading-relaxed">{t('subtitle')}</p>

        <div className="mt-8 bg-slate-50 rounded-xl border border-slate-200 p-6 text-left">
          <h2 className="font-semibold text-slate-900 mb-4">{t('next')}</h2>
          <ol className="space-y-3">
            {steps.map((step: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <span className="text-sm text-slate-600">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/">{t('backHome')}</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/use-cases">
              {t('browseUseCases')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
