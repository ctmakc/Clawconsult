'use client'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, params)
}

// Typed event helpers
export const analytics = {
  ctaClick: (ctaLabel: string, location: string) =>
    trackEvent('cta_click', { cta_label: ctaLabel, location }),

  formStart: (formName: string) =>
    trackEvent('form_start', { form_name: formName }),

  formSubmit: (formName: string, success: boolean) =>
    trackEvent('form_submit', { form_name: formName, success }),

  filterUse: (filterName: string, filterValue: string, page: string) =>
    trackEvent('filter_use', { filter_name: filterName, filter_value: filterValue, page }),

  bookDiscoveryClick: (location: string) =>
    trackEvent('book_discovery_click', { location }),

  outboundClick: (url: string) =>
    trackEvent('outbound_click', { url }),
}
