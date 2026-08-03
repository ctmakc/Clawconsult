import { Link } from '@/i18n/navigation'
import {
  Mail, MessageSquare, Send, Database, GitBranch,
  Zap, BarChart2, CheckCircle2, Clock, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CtaSection } from '@/components/sections/CtaSection'
import { buildMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/utils'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return buildMetadata({
    title: 'ClawHelp Features — AI Customer Service Email Automation',
    description:
      'See every ClawHelp feature: AI email drafting in 1.3s, Telegram approval workflow, knowledge base FTS, thread context, auto-send for confident replies, and daily stats.',
    locale,
    path: `/${locale}/features`,
  })
}

const HOW_IT_WORKS = [
  {
    n: '01',
    icon: Mail,
    title: 'Email Arrives',
    desc: 'A customer sends an email to your support inbox. ClawHelp picks it up instantly via IMAP or API.',
    color: 'text-blue-400',
    bg: 'bg-blue-900/30',
  },
  {
    n: '02',
    icon: Zap,
    title: 'AI Drafts a Reply',
    desc: 'Gemini AI reads the full email thread and your knowledge base, then drafts a contextual reply in 1.3 seconds on average.',
    color: 'text-amber-400',
    bg: 'bg-amber-900/30',
  },
  {
    n: '03',
    icon: MessageSquare,
    title: 'You Approve in Telegram',
    desc: 'You get a Telegram notification with the draft. Tap Approve to send, Edit to adjust, or Decline to skip — typically takes 10 seconds.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-900/30',
  },
]

const FEATURES = [
  {
    icon: Database,
    title: 'Knowledge Base FTS',
    desc: 'Full-text search across your knowledge base documents. The AI finds the right context before drafting, so answers are grounded in your actual policies, prices, and procedures.',
    tags: ['accuracy', 'context'],
  },
  {
    icon: GitBranch,
    title: 'Thread Context Awareness',
    desc: 'Every draft is generated with the full email thread in context. The AI knows what was already said — no more repetitive or contradictory replies.',
    tags: ['continuity', 'quality'],
  },
  {
    icon: Send,
    title: 'Auto-Send for Confident Replies',
    desc: 'High-confidence, low-risk replies (e.g. "what are your hours?") can be set to send automatically. You set the confidence threshold; humans stay in the loop for anything ambiguous.',
    tags: ['speed', 'automation'],
  },
  {
    icon: MessageSquare,
    title: 'Telegram Approval Workflow',
    desc: 'Review and approve email drafts from anywhere in Telegram. The approval interface shows the original email, the draft, and action buttons — all in one message.',
    tags: ['mobile', 'workflow'],
  },
  {
    icon: BarChart2,
    title: 'Daily Stats Dashboard',
    desc: 'See how many emails came in, how many were auto-sent, how many required approval, and average response time — every morning.',
    tags: ['analytics', 'metrics'],
  },
  {
    icon: Clock,
    title: '1.3-Second Draft Speed',
    desc: 'AI drafts are generated via Gemini OAuth (no API key billing). Average draft time is 1.3 seconds, so you are never waiting on the AI.',
    tags: ['speed', 'performance'],
  },
]

const FAQ_ITEMS = [
  {
    q: 'Does ClawHelp send emails automatically without my review?',
    a: 'By default, every draft goes to your Telegram for approval first. Auto-send is an optional feature you configure separately — only for categories you explicitly trust, and only above a confidence threshold you set. You are always in control.',
  },
  {
    q: 'How does the knowledge base integration work?',
    a: 'You upload documents (FAQs, policies, price lists, product info) to your ClawHelp knowledge base. When a new email arrives, the AI performs full-text search across those documents to find relevant context, then includes that context in the prompt when drafting the reply.',
  },
  {
    q: 'What email providers does ClawHelp work with?',
    a: 'ClawHelp works with any IMAP-compatible email provider: Gmail, Outlook, Zoho, FastMail, and custom mail servers. OAuth is supported for Gmail and Outlook for seamless setup.',
  },
  {
    q: 'Do I need a Gemini API key?',
    a: 'No. ClawHelp uses Gemini via Google OAuth (cloudcode-pa integration), which means there are no per-request API charges for the AI drafting. The cost model is different from OpenAI-based tools.',
  },
  {
    q: 'Can multiple team members approve emails?',
    a: 'Yes. You can configure multiple Telegram users as approvers. Round-robin assignment and department routing are available for team setups.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most businesses are live in under 30 minutes: connect your email, upload your knowledge base documents, configure your Telegram bot, and test with a sample email.',
  },
]

export default async function FeaturesPage({ params }: Props) {
  const { locale } = await params

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ClawHelp',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'AI-powered customer service email automation for small businesses.',
    featureList: FEATURES.map((f) => f.title),
    url: absoluteUrl('/'),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      {/* Hero */}
      <section className="bg-slate-900 py-20">
        <div className="container-site max-w-3xl text-center mx-auto">
          <Badge variant="outline" className="mb-4 border-blue-400/40 text-blue-300 bg-transparent">
            AI Customer Service Automation
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            ClawHelp Features
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI drafts customer service email replies in 1.3 seconds. You approve in Telegram in 10 seconds.
            Your customers get a fast, accurate response — every time.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="xl">
              <Link href="/contact">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline-white">
              <Link href="/blog">Read the Blog</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-800">
        <div className="container-site">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How It Works</h2>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto">
              Three steps. No complicated setup. No AI hallucinations going out to customers unsupervised.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.n} className="bg-slate-700/50 rounded-xl p-7 flex flex-col gap-4">
                <div className={`p-3 rounded-xl ${step.bg} w-fit`}>
                  <step.icon className={`h-6 w-6 ${step.color}`} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">{step.n}</span>
                  <h3 className="font-bold text-white text-lg">{step.title}</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-white">
        <div className="container-site">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">All Features</h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Everything you need to handle customer service email at scale, without hiring more support staff.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2.5 rounded-lg bg-blue-50 w-fit mb-4">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {feature.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it beats the old way */}
      <section className="py-20 bg-slate-50">
        <div className="container-site max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            ClawHelp vs. Manual Email
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 pr-6 text-slate-500 font-medium">What</th>
                  <th className="text-left py-3 pr-6 text-slate-500 font-medium">Manual</th>
                  <th className="text-left py-3 text-blue-600 font-medium">ClawHelp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['Draft time', '5–15 minutes', '1.3 seconds'],
                  ['Approval time', 'N/A (you write it)', '10 seconds in Telegram'],
                  ['Knowledge base lookup', 'Manual tab-switching', 'Automatic FTS'],
                  ['Thread context', 'You reread the chain', 'Auto-loaded'],
                  ['Consistency', 'Varies by person/day', 'Consistent tone'],
                  ['After-hours coverage', 'None', 'Drafts 24/7, you approve when ready'],
                ].map(([what, manual, clawhelp]) => (
                  <tr key={what}>
                    <td className="py-3 pr-6 font-medium text-slate-700">{what}</td>
                    <td className="py-3 pr-6 text-slate-500">{manual}</td>
                    <td className="py-3 text-emerald-600 font-medium">{clawhelp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container-site max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  {item.q}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed pl-8">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title="Ready to Handle Customer Emails in 10 Seconds?"
        subtitle="Set up ClawHelp in under 30 minutes. No per-email AI costs."
        primaryCta="Get Started Free"
        primaryHref="/contact"
        secondaryCta="See Use Cases"
        secondaryHref="/use-cases"
      />
    </>
  )
}
