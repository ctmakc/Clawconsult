import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSkills } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import { SkillCard } from '@/components/cards/SkillCard'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string>> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'skills' })
  return buildMetadata({ title: t('title'), description: t('subtitle'), locale, path: `/${locale}/skills` })
}

const TYPE_FILTERS = [
  { value: 'all', label: 'All Types' },
  { value: 'research', label: 'Research' },
  { value: 'extraction', label: 'Extraction' },
  { value: 'enrichment', label: 'Enrichment' },
  { value: 'drafting', label: 'Drafting' },
  { value: 'orchestration', label: 'Orchestration' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'reporting', label: 'Reporting' },
  { value: 'parsing', label: 'Parsing' },
  { value: 'scheduling', label: 'Scheduling' },
]

export default async function SkillsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations({ locale, namespace: 'skills' })

  const typeFilter = sp.type ?? 'all'
  const q = (sp.q ?? '').toLowerCase()

  let skills = await getSkills(locale as Locale)

  if (typeFilter !== 'all') {
    skills = skills.filter((s) => s.capabilityType === typeFilter)
  }
  if (q) {
    skills = skills.filter(
      (s) => s.name.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q)
    )
  }

  return (
    <>
      <section className="bg-slate-900 py-14">
        <div className="container-site">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('title')}</h1>
          <p className="mt-3 text-slate-400 max-w-2xl">{t('subtitle')}</p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-4 sticky top-16 z-30">
        <div className="container-site overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {TYPE_FILTERS.map((f) => (
              <Link
                key={f.value}
                href={f.value === 'all' ? '/skills' : `/skills?type=${f.value}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  typeFilter === f.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-site">
          {skills.length === 0 ? (
            <p className="text-slate-500 text-center py-12">{t('noResults')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {skills.map((skill) => <SkillCard key={skill.slug} skill={skill} />)}
            </div>
          )}
        </div>
      </section>

      <section className="py-10 bg-slate-50 border-t border-slate-200">
        <div className="container-site text-center">
          <h2 className="text-xl font-bold text-slate-900">{t('customCta.title')}</h2>
          <p className="mt-2 text-slate-500">{t('customCta.subtitle')}</p>
          <Button asChild size="lg" className="mt-5">
            <Link href="/contact">{t('customCta.cta')}</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
