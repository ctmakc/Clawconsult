import { NextRequest, NextResponse } from 'next/server'
import { sendLeadNotificationEmail } from '@/lib/email'
import { ContactSchema, type ContactFormData, checkRateLimit } from './_logic'

async function notifyWebhook(data: ContactFormData) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL
  if (!webhookUrl) return

  const body = {
    text: `New Discovery Request from ${data.name} (${data.company})`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Discovery Request*\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Company:* ${data.company}\n*Role:* ${data.role}\n*Country:* ${data.country}\n*Interest:* ${data.interestType}\n*Budget:* ${data.budgetRange ?? 'not specified'}\n*Timeline:* ${data.timeline ?? 'not specified'}\n*Service:* ${data.service ?? '-'}\n---\n*Situation:* ${data.currentSituation}\n---\n*Goals:* ${data.goals}`,
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
    console.error('Webhook notification failed')
  }
}

async function verifyTurnstile(token?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false

  try {
    const formData = new FormData()
    formData.set('secret', secret)
    formData.set('response', token)

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) return false
    const result = (await response.json()) as { success?: boolean }
    return Boolean(result.success)
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
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

  const rawBody = body as Record<string, unknown>
  if (rawBody.website_url && String(rawBody.website_url).length > 0) {
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

  if (!(await verifyTurnstile(data.turnstileToken))) {
    return NextResponse.json(
      { error: 'CAPTCHA verification failed. Please retry.' },
      { status: 422 }
    )
  }

  await notifyWebhook(data)

  await sendLeadNotificationEmail({
    name: data.name,
    email: data.email,
    company: data.company,
    role: data.role,
    interestType: data.interestType,
    budgetRange: data.budgetRange,
    timeline: data.timeline,
    currentSituation: data.currentSituation,
    goals: data.goals,
  })

  console.log('Contact form submission', {
    name: data.name,
    company: data.company,
    email: data.email,
    interestType: data.interestType,
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json({ success: true })
}
