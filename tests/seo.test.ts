import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { buildMetadata } from '@/lib/seo'

describe('buildMetadata', () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com'
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = original
  })

  it('builds canonical and hreflang alternates for all locales', () => {
    const meta = buildMetadata({
      title: 'Test',
      locale: 'ru',
      path: '/ru/services/test-service',
    })

    expect(meta.alternates?.canonical?.toString()).toBe('https://example.com/ru/services/test-service')
    expect(meta.alternates?.languages?.en?.toString()).toBe('https://example.com/en/services/test-service')
    expect(meta.alternates?.languages?.ru?.toString()).toBe('https://example.com/ru/services/test-service')
    expect(meta.alternates?.languages?.fr?.toString()).toBe('https://example.com/fr/services/test-service')
    expect(meta.alternates?.languages?.['x-default']?.toString()).toBe('https://example.com/en/services/test-service')
  })
})
