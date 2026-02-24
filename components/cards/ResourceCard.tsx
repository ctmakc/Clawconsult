import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Resource } from '@/types/domain'
import { formatDate } from '@/lib/utils'

interface ResourceCardProps {
  resource: Resource
  locale: string
}

export function ResourceCard({ resource, locale }: ResourceCardProps) {
  const t = useTranslations('resources')

  return (
    <Card className="flex flex-col h-full group hover:ring-1 hover:ring-blue-200 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="category">
            {t(`categories.${resource.category}` as Parameters<typeof t>[0])}
          </Badge>
        </div>
        <CardTitle className="text-base group-hover:text-blue-600 transition-colors line-clamp-2">
          {resource.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">{resource.excerpt}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-end">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{formatDate(resource.publishDate, locale)}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {resource.readTime} {t('minRead')}
            </span>
          </div>
          <Link
            href={`/resources/${resource.slug}`}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium group/link"
          >
            {t('readMore')}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
