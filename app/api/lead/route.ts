import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      error: 'Use /api/contact for MVP lead submissions',
      route: '/api/contact',
    },
    { status: 501 }
  )
}
