'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LocaleSwitcher } from './LocaleSwitcher'

interface NavItem {
  labelKey: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'services', href: '/services' },
  { labelKey: 'useCases', href: '/use-cases' },
  { labelKey: 'skills', href: '/skills' },
  { labelKey: 'templates', href: '/templates' },
  { labelKey: 'security', href: '/security' },
  { labelKey: 'pricing', href: '/pricing' },
  { labelKey: 'resources', href: '/resources' },
  { labelKey: 'about', href: '/about' },
]

export function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm group-hover:bg-blue-700 transition-colors">
              OC
            </div>
            <span className="hidden sm:block font-bold text-slate-900 text-lg leading-none">
              OpenClaw
              <span className="block text-xs font-medium text-slate-500 leading-none">Consulting</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    active
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )}
                >
                  {t(item.labelKey as Parameters<typeof t>[0])}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/book-discovery">{t('bookDiscovery')}</Link>
            </Button>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={t('toggleMenu')}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    active
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {t(item.labelKey as Parameters<typeof t>[0])}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-slate-100 mt-1">
              <Button asChild size="default" className="w-full">
                <Link href="/book-discovery" onClick={() => setMobileOpen(false)}>
                  {t('bookDiscovery')}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
