import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

export default async function NotFound() {
  const t = await getTranslations('errors.404')

  return (
    <div className="min-h-[70vh] flex items-center py-16">
      <div className="container-site max-w-md mx-auto text-center">
        <p className="text-7xl font-bold text-slate-200">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{t('title')}</h1>
        <p className="mt-3 text-slate-500">{t('subtitle')}</p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/">{t('cta')}</Link>
        </Button>
      </div>
    </div>
  )
}
