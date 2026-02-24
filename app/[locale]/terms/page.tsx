import { buildMetadata } from '@/lib/seo'
import { formatDate } from '@/lib/utils'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return buildMetadata({ title: 'Terms of Service', noIndex: true, locale, path: `/${locale}/terms` })
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  const updatedDate = formatDate('2026-01-01', locale)

  return (
    <div className="py-14">
      <div className="container-site max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {updatedDate}</p>

        <div className="mt-8 prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900">1. Services</h2>
            <p>OpenClaw Consulting Inc. provides AI agent consulting, implementation, and support services. Specific terms of each engagement are governed by a separate Statement of Work (SOW) or service agreement signed by both parties.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900">2. Website Use</h2>
            <p>This website is provided for informational purposes. You may browse, share links, and contact us via the forms provided. You may not scrape, reproduce, or redistribute site content without written permission.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900">3. No Warranty</h2>
            <p>Information on this site is provided in good faith but without warranty. Consulting outcomes depend on your specific environment, data quality, and team engagement. We do not guarantee specific results.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900">4. Intellectual Property</h2>
            <p>All content on this site (text, graphics, code examples, framework documentation) is the intellectual property of OpenClaw Consulting Inc. unless otherwise noted.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900">5. Governing Law</h2>
            <p>These terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900">6. Contact</h2>
            <p>OpenClaw Consulting Inc. · Ottawa, ON, Canada · hello@openclaw.ca</p>
          </section>
        </div>
      </div>
    </div>
  )
}
