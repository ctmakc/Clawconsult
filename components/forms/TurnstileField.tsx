'use client'

import { useEffect, useId, useRef } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    turnstile?: {
      render: (
        selector: string | HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
        }
      ) => string
      reset?: (widgetId?: string) => void
    }
  }
}

interface TurnstileFieldProps {
  onToken: (token: string) => void
}

export function TurnstileField({ onToken }: TurnstileFieldProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const id = useId().replace(/:/g, '')

  useEffect(() => {
    if (!siteKey || !window.turnstile || !containerRef.current || widgetIdRef.current) return

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => onToken(token),
      'expired-callback': () => onToken(''),
      'error-callback': () => onToken(''),
      theme: 'auto',
    })
  }, [onToken, siteKey])

  if (!siteKey) return null

  return (
    <div className="space-y-2">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div id={`turnstile-${id}`} ref={containerRef} />
    </div>
  )
}
