import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { MapPin, Mail } from 'lucide-react'

export function Footer() {
  const t = useTranslations('footer')

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                OC
              </div>
              <span className="font-bold text-white text-lg leading-none">
                OpenClaw
                <span className="block text-xs font-medium text-slate-400 leading-none">Consulting</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{t('location')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                <a href="mailto:hello@openclaw.ca" className="hover:text-slate-300 transition-colors">
                  hello@openclaw.ca
                </a>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              {t('company')}
            </h3>
            <ul className="space-y-2.5">
              {[
                { key: 'about', href: '/about' },
                { key: 'contact', href: '/contact' },
              ].map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href as '/about' | '/contact'}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t(key as Parameters<typeof t>[0])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              {t('solutions')}
            </h3>
            <ul className="space-y-2.5">
              {[
                { key: 'services', href: '/services' },
                { key: 'useCases', href: '/use-cases' },
                { key: 'templates', href: '/templates' },
              ].map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href as '/services' | '/use-cases' | '/templates'}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t(key as Parameters<typeof t>[0])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Knowledge + Legal */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              {t('knowledge')}
            </h3>
            <ul className="space-y-2.5 mb-6">
              {[
                { key: 'skills', href: '/skills' },
                { key: 'resources', href: '/resources' },
              ].map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href as '/skills' | '/resources'}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t(key as Parameters<typeof t>[0])}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              {t('legal')}
            </h3>
            <ul className="space-y-2.5">
              {[
                { key: 'privacy', href: '/privacy' },
                { key: 'terms', href: '/terms' },
              ].map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href as '/privacy' | '/terms'}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t(key as Parameters<typeof t>[0])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} OpenClaw Consulting Inc. {t('rights')}
          </p>
          <Link
            href="/contact"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            {t('bookCta')} →
          </Link>
        </div>
      </div>
    </footer>
  )
}
