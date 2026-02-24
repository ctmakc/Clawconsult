import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { UseCase } from '@/types/domain'
import { cn } from '@/lib/utils'

const COMPLEXITY_VARIANT = {
  low: 'L1' as const,
  medium: 'L2' as const,
  high: 'L3' as const,
}

const FUNCTION_COLORS: Record<string, string> = {
  founder: 'bg-purple-50 text-purple-700 border-purple-200',
  sales: 'bg-green-50 text-green-700 border-green-200',
  ops: 'bg-blue-50 text-blue-700 border-blue-200',
  marketing: 'bg-pink-50 text-pink-700 border-pink-200',
  recruiting: 'bg-orange-50 text-orange-700 border-orange-200',
  'finance-admin': 'bg-teal-50 text-teal-700 border-teal-200',
}

interface UseCaseCardProps {
  useCase: UseCase
  compact?: boolean
}

export function UseCaseCard({ useCase, compact = false }: UseCaseCardProps) {
  const t = useTranslations('useCases')
  const tBadges = useTranslations('badges')

  return (
    <Card className={cn('flex flex-col h-full group', useCase.featured && 'ring-1 ring-blue-200')}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border',
              FUNCTION_COLORS[useCase.functionCategory] ?? 'bg-slate-100 text-slate-600 border-slate-200'
            )}
          >
            {useCase.functionCategory.charAt(0).toUpperCase() + useCase.functionCategory.slice(1)}
          </span>
          <Badge variant={COMPLEXITY_VARIANT[useCase.implementationComplexity]}>
            {tBadges(COMPLEXITY_VARIANT[useCase.implementationComplexity])}
          </Badge>
        </div>
        <CardTitle className="group-hover:text-blue-600 transition-colors text-base">
          {useCase.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">{useCase.summary}</CardDescription>
      </CardHeader>

      {!compact && (
        <CardContent className="flex-1 flex flex-col justify-between gap-4">
          <ul className="space-y-1">
            {useCase.expectedImpact.slice(0, 2).map((impact, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                {impact}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {useCase.rolePersona}
            </span>
            <Button asChild size="sm" variant="ghost" className="group/btn">
              <Link href={`/use-cases/${useCase.slug}`}>
                {t('viewDetails')}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
