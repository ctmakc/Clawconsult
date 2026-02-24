'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

const COOKIE_KEY = 'oc_cookie_consent'

export function CookieBanner() {
  const t = useTranslations('cookie')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY)
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(COOKIE_KEY, 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, 'declined')
    setVisible(false)
  }

  function customize() {
    // MVP: store a distinct state and direct users to privacy/cookies details.
    localStorage.setItem(COOKIE_KEY, 'customized')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 rounded-xl border border-slate-200 bg-white shadow-xl p-4"
    >
      <button
        onClick={decline}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>

      <p className="text-sm text-slate-600 leading-relaxed pr-6">
        {t('message')}{' '}
        <Link href="/privacy" className="text-blue-600 hover:underline">
          {t('learnMore')}
        </Link>
      </p>

      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={accept} className="flex-1">
          {t('accept')}
        </Button>
        <Button size="sm" variant="outline" onClick={customize} className="flex-1">
          {t('customize')}
        </Button>
        <Button size="sm" variant="outline" onClick={decline} className="flex-1">
          {t('decline')}
        </Button>
      </div>
    </div>
  )
}
