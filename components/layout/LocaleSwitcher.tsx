'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('common.locale')

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next })
  }

  return (
    <div className="flex items-center gap-1">
      <Globe className="h-4 w-4 text-slate-400" />
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={cn(
            'px-1.5 py-0.5 text-xs font-medium rounded transition-colors uppercase',
            locale === l
              ? 'text-blue-600 bg-blue-50'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          )}
          aria-label={t(l)}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
