import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import type { Service, UseCase, Skill, Template } from '@/types/domain'

interface RelatedContentProps {
  services?: Service[]
  useCases?: UseCase[]
  skills?: Skill[]
  templates?: Template[]
}

function RelatedList<T extends { slug: string; title?: string; name?: string }>({
  items,
  labelKey,
  basePath,
}: {
  items: T[]
  labelKey: string
  basePath: string
}) {
  const t = useTranslations('common')
  if (!items.length) return null

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        {t(labelKey as Parameters<typeof t>[0])}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`${basePath}/${item.slug}` as Parameters<typeof Link>[0]['href']}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline group"
            >
              <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              {item.title ?? item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function RelatedContent({ services = [], useCases = [], skills = [], templates = [] }: RelatedContentProps) {
  const hasAny = services.length > 0 || useCases.length > 0 || skills.length > 0 || templates.length > 0
  if (!hasAny) return null

  return (
    <aside className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-6">
      <RelatedList items={services} labelKey="relatedServices" basePath="/services" />
      <RelatedList items={useCases} labelKey="relatedUseCases" basePath="/use-cases" />
      <RelatedList items={skills} labelKey="relatedSkills" basePath="/skills" />
      <RelatedList items={templates} labelKey="relatedTemplates" basePath="/templates" />
    </aside>
  )
}
