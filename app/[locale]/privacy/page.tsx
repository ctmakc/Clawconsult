import { buildMetadata } from '@/lib/seo'
import { formatDate } from '@/lib/utils'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return buildMetadata({ title: 'Privacy Policy', noIndex: true, locale, path: `/${locale}/privacy` })
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const updatedDate = formatDate('2026-01-01', locale)

  return (
    <div className="py-14">
      <div className="container-site max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {updatedDate}</p>

        <div className="mt-8 prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
            <p>We collect information you provide directly through our contact form: name, email, company, role, and the details you share about your project. We also collect standard web analytics data (page views, referrers) through Google Analytics if you consent to cookies.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900">2. How We Use Your Information</h2>
            <p>We use your contact form submissions solely to respond to your inquiry and facilitate a potential engagement. We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900">3. Data Storage</h2>
            <p>Form submissions are processed securely and delivered to our internal systems. We retain inquiry data for up to 2 years for business continuity purposes, then permanently delete it.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900">4. Cookies</h2>
            <p>We use essential cookies for site functionality and optional analytics cookies (Google Analytics). You can decline analytics cookies via the cookie banner. Essential cookies cannot be disabled as they are necessary for the site to function.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete any personal data we hold about you. Contact us at hello@openclaw.ca with any requests.</p>
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
