import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Clock, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Service, FormatOption } from '@/types/domain'
import { cn } from '@/lib/utils'

const FORMAT_VARIANT: Record<FormatOption, 'remote' | 'onsite' | 'hybrid'> = {
  remote: 'remote',
  'onsite-ottawa': 'onsite',
  hybrid: 'hybrid',
  async: 'remote',
}

interface ServiceCardProps {
  service: Service
  compact?: boolean
}

export function ServiceCard({ service, compact = false }: ServiceCardProps) {
  const t = useTranslations('services')

  return (
    <Card className={cn('flex flex-col h-full group', service.featured && 'ring-1 ring-blue-200')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-1.5">
            {service.formatOptions.slice(0, 2).map((f) => (
              <Badge key={f} variant={FORMAT_VARIANT[f] ?? 'secondary'}>
                {f === 'onsite-ottawa' ? 'Onsite Ottawa' : f.charAt(0).toUpperCase() + f.slice(1)}
              </Badge>
            ))}
          </div>
          {service.featured && (
            <Badge variant="default" className="shrink-0">Featured</Badge>
          )}
        </div>
        <CardTitle className="group-hover:text-blue-600 transition-colors">
          {service.title}
        </CardTitle>
        <CardDescription>{service.shortDescription}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between gap-4">
        {!compact && (
          <ul className="space-y-1">
            {service.outcomes.slice(0, 3).map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                {o}
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {service.durationText}
            </span>
            {service.audience[0] && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {service.audience[0]}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">{t('pricingFrom')} </span>
              <span className="text-sm font-semibold text-slate-900">{service.pricingFrom}</span>
            </div>
            <Button asChild size="sm" variant="ghost" className="group/btn">
              <Link href={`/services/${service.slug}`}>
                {t('learnMore')}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
