import type { Metadata } from 'next'
import '@/app/globals.css'
import { getSiteOrigin } from '@/lib/utils'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
