import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Clock, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Template } from '@/types/domain'

interface TemplateCardProps {
  template: Template
}

export function TemplateCard({ template }: TemplateCardProps) {
  const t = useTranslations('templates')
  const tBadges = useTranslations('badges')

  const complexityMap = { low: 'L1', medium: 'L2', high: 'L3' } as const

  return (
    <Card className="flex flex-col h-full group ring-1 ring-slate-200 hover:ring-blue-200 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={complexityMap[template.complexity]}>
            {tBadges(complexityMap[template.complexity])}
          </Badge>
          <span className="text-xs text-slate-400 font-mono">v{template.version}</span>
        </div>
        <CardTitle className="group-hover:text-blue-600 transition-colors">
          {template.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">{template.summary}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between gap-4">
        <ul className="space-y-1">
          {template.goals.slice(0, 3).map((goal, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              {goal}
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {template.timeline}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              {template.includedSkills.length} {t('includedSkills')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">{t('pricingFrom')} </span>
              <span className="text-sm font-semibold text-slate-900">{template.pricingFrom}</span>
            </div>
            <Button asChild size="sm" variant="ghost" className="group/btn">
              <Link href={`/templates/${template.slug}`}>
                {t('viewDetails')}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
