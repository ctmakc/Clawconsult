export interface LeadEmailPayload {
  name: string
  email: string
  company?: string
  role?: string
  interestType?: string
  budgetRange?: string
  timeline?: string
  currentSituation?: string
  goals?: string
}

interface EmailProvider {
  sendLeadNotification(payload: LeadEmailPayload): Promise<void>
}

class ResendProvider implements EmailProvider {
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
    private readonly to: string
  ) {}

  async sendLeadNotification(payload: LeadEmailPayload): Promise<void> {
    const subject = `New Discovery Request: ${payload.name}${payload.company ? ` (${payload.company})` : ''}`
    const lines = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Company: ${payload.company ?? '—'}`,
      `Role: ${payload.role ?? '—'}`,
      `Interest: ${payload.interestType ?? '—'}`,
      `Budget: ${payload.budgetRange ?? '—'}`,
      `Timeline: ${payload.timeline ?? '—'}`,
      '',
      'Current Situation:',
      payload.currentSituation ?? '—',
      '',
      'Goals:',
      payload.goals ?? '—',
    ]

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.from,
        to: [this.to],
        subject,
        text: lines.join('\n'),
      }),
    })

    if (!response.ok) {
      throw new Error(`Resend API failed with status ${response.status}`)
    }
  }
}

class NoopProvider implements EmailProvider {
  async sendLeadNotification(): Promise<void> {
    return
  }
}

function getProvider(): EmailProvider {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.FROM_EMAIL
  const to = process.env.NOTIFICATION_EMAIL

  if (apiKey && from && to) {
    return new ResendProvider(apiKey, from, to)
  }

  return new NoopProvider()
}

export async function sendLeadNotificationEmail(payload: LeadEmailPayload): Promise<void> {
  const provider = getProvider()
  try {
    await provider.sendLeadNotification(payload)
  } catch (error) {
    console.error('Lead email notification failed', error)
  }
}
