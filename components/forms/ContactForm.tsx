'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { analytics } from '@/lib/analytics'

interface FormData {
  name: string
  email: string
  company: string
  role: string
  website: string
  country: string
  city: string
  companySize: string
  industry: string
  interestType: string
  budgetRange: string
  timeline: string
  currentSituation: string
  goals: string
  preferredFormat: string
  consent: boolean
  // Honeypot
  website_url: string
  // UTM
  utm_source: string
  utm_medium: string
  utm_campaign: string
  // Pre-fill
  service: string
  skill: string
  template: string
  usecase: string
}

const INITIAL_FORM: FormData = {
  name: '', email: '', company: '', role: '', website: '',
  country: 'Canada', city: '', companySize: '', industry: '',
  interestType: '', budgetRange: '', timeline: '', currentSituation: '',
  goals: '', preferredFormat: 'remote', consent: false,
  website_url: '',
  utm_source: '', utm_medium: '', utm_campaign: '',
  service: '', skill: '', template: '', usecase: '',
}

type FieldError = Partial<Record<keyof FormData, string>>

function validate(data: FormData): FieldError {
  const errors: FieldError = {}
  if (!data.name.trim() || data.name.length < 2) errors.name = 'Required'
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Valid email required'
  if (!data.company.trim()) errors.company = 'Required'
  if (!data.role.trim()) errors.role = 'Required'
  if (!data.country.trim()) errors.country = 'Required'
  if (!data.companySize) errors.companySize = 'Required'
  if (!data.industry.trim()) errors.industry = 'Required'
  if (!data.interestType) errors.interestType = 'Required'
  if (!data.currentSituation.trim() || data.currentSituation.length < 10) errors.currentSituation = 'Please describe your situation (min 10 chars)'
  if (!data.goals.trim() || data.goals.length < 10) errors.goals = 'Please describe your goals (min 10 chars)'
  if (!data.consent) errors.consent = 'You must accept the privacy policy'
  return errors
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null
  return <p className="mt-1 text-xs text-red-600">{error}</p>
}

export function ContactForm() {
  const t = useTranslations('contact')
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [form, setForm] = useState<FormData>(() => ({
    ...INITIAL_FORM,
    service: searchParams.get('service') ?? '',
    skill: searchParams.get('skill') ?? '',
    template: searchParams.get('template') ?? '',
    usecase: searchParams.get('usecase') ?? '',
    interestType: searchParams.get('service') ? 'build' : searchParams.get('skill') ? 'build' : '',
  }))

  const [errors, setErrors] = useState<FieldError>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  // Capture UTM params on mount
  useEffect(() => {
    setForm((f) => ({
      ...f,
      utm_source: searchParams.get('utm_source') ?? '',
      utm_medium: searchParams.get('utm_medium') ?? '',
      utm_campaign: searchParams.get('utm_campaign') ?? '',
    }))
    analytics.formStart('contact')
  }, [searchParams])

  function set(field: keyof FormData, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const fieldErrors = validate(form)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setStatus('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Server error')

      analytics.formSubmit('contact', true)
      setStatus('success')
      router.push(`/${locale}/thank-you`)
    } catch {
      analytics.formSubmit('contact', false)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium text-emerald-600">{t('form.success')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot - hidden from real users */}
      <div style={{ display: 'none' }} aria-hidden>
        <Input
          tabIndex={-1}
          autoComplete="off"
          value={form.website_url}
          onChange={(e) => set('website_url', e.target.value)}
        />
      </div>

      {/* Section 1: Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel label={t('form.name')} required />
          <Input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Jane Smith"
            className={cn(errors.name && 'border-red-400')}
          />
          <FieldError error={errors.name} />
        </div>
        <div>
          <FieldLabel label={t('form.email')} required />
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="jane@company.com"
            className={cn(errors.email && 'border-red-400')}
          />
          <FieldError error={errors.email} />
        </div>
        <div>
          <FieldLabel label={t('form.company')} required />
          <Input
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            placeholder="Acme Corp"
            className={cn(errors.company && 'border-red-400')}
          />
          <FieldError error={errors.company} />
        </div>
        <div>
          <FieldLabel label={t('form.role')} required />
          <Input
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
            placeholder="CEO / Operations Manager"
            className={cn(errors.role && 'border-red-400')}
          />
          <FieldError error={errors.role} />
        </div>
        <div>
          <FieldLabel label={t('form.country')} required />
          <Input
            value={form.country}
            onChange={(e) => set('country', e.target.value)}
            className={cn(errors.country && 'border-red-400')}
          />
          <FieldError error={errors.country} />
        </div>
        <div>
          <FieldLabel label={t('form.city')} />
          <Input
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            placeholder="Ottawa"
          />
        </div>
      </div>

      {/* Section 2: Company context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel label={t('form.companySize')} required />
          <Select value={form.companySize} onValueChange={(v) => set('companySize', v)}>
            <SelectTrigger className={cn(errors.companySize && 'border-red-400')}>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(t.raw('companySizeOptions') as Record<string, string>).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError error={errors.companySize} />
        </div>
        <div>
          <FieldLabel label={t('form.industry')} required />
          <Input
            value={form.industry}
            onChange={(e) => set('industry', e.target.value)}
            placeholder="Legal / Marketing / Finance…"
            className={cn(errors.industry && 'border-red-400')}
          />
          <FieldError error={errors.industry} />
        </div>
      </div>

      {/* Section 3: Engagement context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel label={t('form.interestType')} required />
          <Select value={form.interestType} onValueChange={(v) => set('interestType', v)}>
            <SelectTrigger className={cn(errors.interestType && 'border-red-400')}>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(t.raw('interestOptions') as Record<string, string>).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError error={errors.interestType} />
        </div>
        <div>
          <FieldLabel label={t('form.budgetRange')} />
          <Select value={form.budgetRange} onValueChange={(v) => set('budgetRange', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(t.raw('budgetOptions') as Record<string, string>).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <FieldLabel label={t('form.timeline')} />
          <Select value={form.timeline} onValueChange={(v) => set('timeline', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(t.raw('timelineOptions') as Record<string, string>).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <FieldLabel label={t('form.preferredFormat')} />
          <Select value={form.preferredFormat} onValueChange={(v) => set('preferredFormat', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(t.raw('formatOptions') as Record<string, string>).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Section 4: Situation & Goals */}
      <div>
        <FieldLabel label={t('form.currentSituation')} required />
        <Textarea
          value={form.currentSituation}
          onChange={(e) => set('currentSituation', e.target.value)}
          placeholder="Describe your current tools, team size, and what you're struggling with…"
          rows={4}
          className={cn(errors.currentSituation && 'border-red-400')}
        />
        <FieldError error={errors.currentSituation} />
      </div>
      <div>
        <FieldLabel label={t('form.goals')} required />
        <Textarea
          value={form.goals}
          onChange={(e) => set('goals', e.target.value)}
          placeholder="What would success look like? What do you want to automate or improve?"
          rows={4}
          className={cn(errors.goals && 'border-red-400')}
        />
        <FieldError error={errors.goals} />
      </div>

      {/* Consent */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={form.consent}
          onCheckedChange={(v) => set('consent', Boolean(v))}
          className={cn('mt-0.5', errors.consent && 'border-red-400')}
        />
        <label htmlFor="consent" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
          {t('form.consent')}
        </label>
      </div>
      {errors.consent && <FieldError error={errors.consent} />}

      {/* Submit */}
      {status === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{t('form.error')}</p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === 'submitting'}
        className="w-full sm:w-auto"
      >
        {status === 'submitting' ? t('form.submitting') : t('form.submit')}
      </Button>
    </form>
  )
}
