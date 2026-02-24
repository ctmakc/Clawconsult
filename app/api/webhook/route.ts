import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const expected = process.env.CRM_WEBHOOK_SECRET
  const provided = req.headers.get('x-webhook-secret') ?? ''

  if (expected && provided !== expected) {
    return NextResponse.json({ error: 'Unauthorized webhook' }, { status: 401 })
  }

  let body: unknown = null
  try {
    body = await req.json()
  } catch {
    // Allow empty payloads in MVP stub mode.
  }

  console.log('Webhook received (MVP stub)', body)
  return NextResponse.json({ success: true, received: true })
}
