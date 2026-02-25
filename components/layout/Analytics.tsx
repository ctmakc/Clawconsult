'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const COOKIE_KEY = 'oc_cookie_consent'
const CONSENT_EVENT = 'oc-cookie-consent-change'

function readConsent() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(COOKIE_KEY)
}

export function Analytics() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const sync = () => setEnabled(readConsent() === 'accepted')
    sync()

    window.addEventListener(CONSENT_EVENT, sync as EventListener)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync as EventListener)
      window.removeEventListener('storage', sync)
    }
  }, [])

  if (!GA_ID || !enabled) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  )
}
