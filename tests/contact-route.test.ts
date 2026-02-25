import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/contact/route'
import { resetContactRateLimitForTests } from '@/app/api/contact/_logic'

vi.mock('@/lib/email', () => ({
  sendLeadNotificationEmail: vi.fn(async () => undefined),
}))

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: 'Jane Smith',
    email: 'jane@example.com',
    company: 'Acme',
    role: 'CEO',
    website: '',
    country: 'Canada',
    city: 'Ottawa',
    companySize: '2to10',
    industry: 'Legal',
    interestType: 'build',
    budgetRange: '5k10k',
    timeline: '1to3months',
    currentSituation: 'We have repetitive admin tasks and too much manual work.',
    goals: 'Automate intake and reporting while keeping human approvals.',
    preferredFormat: 'remote',
    consent: true,
    website_url: '',
    ...overrides,
  }
}

function makeReq(body: unknown, ip = '1.2.3.4') {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

describe('/api/contact POST', () => {
  beforeEach(() => {
    resetContactRateLimitForTests()
    vi.restoreAllMocks()
    process.env.TURNSTILE_SECRET_KEY = ''
    process.env.CONTACT_WEBHOOK_URL = ''
  })

  it('returns success for valid payload', async () => {
    const res = await POST(makeReq(validPayload()))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ success: true })
  })

  it('silently succeeds honeypot spam submissions', async () => {
    const res = await POST(makeReq(validPayload({ website_url: 'spam' })))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ success: true })
  })

  it('returns validation error for invalid payload', async () => {
    const res = await POST(makeReq(validPayload({ email: 'bad', consent: false })))
    expect(res.status).toBe(422)
    const data = await res.json()
    expect(data.error).toBe('Validation failed')
  })

  it('rate-limits after 5 requests per IP', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeReq(validPayload(), '9.9.9.9'))
      expect(res.status).toBe(200)
    }
    const limited = await POST(makeReq(validPayload(), '9.9.9.9'))
    expect(limited.status).toBe(429)
  })

  it('enforces turnstile when secret key configured', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret'
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: false }), { status: 200 })))

    const res = await POST(makeReq(validPayload({ turnstileToken: 'token' })))
    expect(res.status).toBe(422)
    const data = await res.json()
    expect(data.error).toContain('CAPTCHA')
  })
})
