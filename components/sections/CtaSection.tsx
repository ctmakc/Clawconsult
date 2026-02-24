import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CtaSectionProps {
  title: string
  subtitle?: string
  primaryCta: string
  primaryHref: string
  secondaryCta?: string
  secondaryHref?: string
  dark?: boolean
  className?: string
}

export function CtaSection({
  title,
  subtitle,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
  dark = false,
  className,
}: CtaSectionProps) {
  return (
    <section
      className={cn(
        'py-16 sm:py-20',
        dark ? 'bg-slate-900' : 'bg-blue-600',
        className
      )}
    >
      <div className="container-site text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
        {subtitle && (
          <p className="mt-3 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">{subtitle}</p>
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" variant={dark ? 'default' : 'outline-white'}>
            <Link href={primaryHref}>{primaryCta}</Link>
          </Button>
          {secondaryCta && secondaryHref && (
            <Button asChild size="lg" variant="outline-white">
              <Link href={secondaryHref}>{secondaryCta}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
