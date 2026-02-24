import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ── Validation schema ─────────────────────────────────────────────────────────

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(100),
  website: z.string().url().or(z.literal('')).optional(),
  country: z.string().min(1).max(100),
  city: z.string().optional(),
  companySize: z.string().min(1),
  industry: z.string().min(1).max(100),
  interestType: z.string().min(1),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  currentSituation: z.string().min(10).max(2000),
  goals: z.string().min(10).max(2000),
  preferredFormat: z.string().optional(),
  consent: z.literal(true),
  // Honeypot anti-spam field — must be empty
  website_url: z.string().max(0).optional(),
  // UTM params
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
  // Pre-filled from URL params
  service: z.string().optional(),
  skill: z.string().optional(),
  template: z.string().optional(),
  usecase: z.string().optional(),
})

export type ContactFormData = z.infer<typeof ContactSchema>

// ── Rate limiting (simple in-memory, per IP) ──────────────────────────────────

const rateLimitMap = new Map<string, { count: number; reset: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour
  const maxRequests = 5

  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + windowMs })
    return true
  }

  if (entry.count >= maxRequests) return false

  entry.count++
  return true
}

// ── Webhook / notification ────────────────────────────────────────────────────

async function notifyWebhook(data: ContactFormData, meta: { ip: string; userAgent: string }) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL
  if (!webhookUrl) return

  const body = {
    text: `New Discovery Request from ${data.name} (${data.company})`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Discovery Request*\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Company:* ${data.company}\n*Role:* ${data.role}\n*Country:* ${data.country}\n*Interest:* ${data.interestType}\n*Budget:* ${data.budgetRange ?? 'not specified'}\n*Timeline:* ${data.timeline ?? 'not specified'}\n*Service:* ${data.service ?? '—'}\n---\n*Situation:* ${data.currentSituation}\n---\n*Goals:* ${data.goals}`,
        },
      },
    ],
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    // Webhook failure should not block form submission response
    console.error('Webhook notification failed')
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Get IP for rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in an hour.' },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Honeypot check
  const rawBody = body as Record<string, unknown>
  if (rawBody.website_url && String(rawBody.website_url).length > 0) {
    // Silent success to confuse bots
    return NextResponse.json({ success: true })
  }

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const data = parsed.data

  // Notify via webhook
  await notifyWebhook(data, {
    ip,
    userAgent: req.headers.get('user-agent') ?? '',
  })

  // Log server-side (in production, replace with proper logging)
  console.log('Contact form submission', {
    name: data.name,
    company: data.company,
    email: data.email,
    interestType: data.interestType,
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}
