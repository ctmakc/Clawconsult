import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ShieldCheck, UserCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Skill } from '@/types/domain'
import { cn } from '@/lib/utils'

interface SkillCardProps {
  skill: Skill
  compact?: boolean
}

export function SkillCard({ skill, compact = false }: SkillCardProps) {
  const t = useTranslations('skills')
  const tBadges = useTranslations('badges')

  const statusVariant =
    skill.status === 'stable' ? 'stable' :
    skill.status === 'beta' ? 'beta' :
    skill.status === 'deprecated' ? 'deprecated' : 'draft'

  return (
    <Card className={cn('flex flex-col h-full group', skill.featured && 'ring-1 ring-blue-200')}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Badge variant={statusVariant}>{tBadges(skill.status)}</Badge>
            <Badge variant={skill.complexity as 'L1' | 'L2' | 'L3'}>
              {tBadges(skill.complexity)}
            </Badge>
          </div>
          <span className="text-xs text-slate-400 font-mono">v{skill.version}</span>
        </div>
        <CardTitle className="group-hover:text-blue-600 transition-colors text-base">
          {skill.name}
        </CardTitle>
        <CardDescription className="line-clamp-2">{skill.shortDescription}</CardDescription>
      </CardHeader>

      {!compact && (
        <CardContent className="flex-1 flex flex-col justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {skill.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                {tag}
              </span>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              {skill.doneForYouAvailable && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t('doneForYou')}
                </span>
              )}
              {skill.requiresHumanApproval && (
                <span className="flex items-center gap-1 text-amber-600">
                  <UserCheck className="h-3.5 w-3.5" />
                  {t('requiresApproval')}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Badge variant={skill.dataSensitivityLevel as 'public' | 'internal' | 'confidential' | 'restricted'}>
                {tBadges(skill.dataSensitivityLevel)}
              </Badge>
              <Button asChild size="sm" variant="ghost" className="group/btn">
                <Link href={`/skills/${skill.slug}`}>
                  {t('viewDetails')}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
