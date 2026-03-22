import { describe, expect, it } from 'vitest'
import { normalizeArrayPayload, normalizeItem } from '@/lib/content'

describe('content normalization', () => {
  it('extracts arrays from wrapped legacy payloads', () => {
    const payload = { services: [{ slug: 'x' }] }
    expect(normalizeArrayPayload(payload, 'services')).toEqual([{ slug: 'x' }])
  })

  it('normalizes legacy service fields', () => {
    const item = normalizeItem(
      {
        category: 'assessment',
        status: 'active',
        formatOptions: ['remote', 'onsite'],
        pricingFrom: 1500,
      },
      'services'
    ) as Record<string, unknown>

    expect(item.category).toBe('strategy')
    expect(item.status).toBe('published')
    expect(item.formatOptions).toEqual(['remote', 'onsite-ottawa'])
    expect(item.pricingFrom).toBe('CAD 1,500')
  })
})
