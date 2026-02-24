import type { Service, UseCase, Skill, Template, Resource } from '@/types/domain'

type Locale = 'en' | 'ru' | 'fr'

// ── Generic loader ────────────────────────────────────────────────────────────

function normalizeArrayPayload(payload: unknown, entity: string): unknown[] | null {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return null

  const record = payload as Record<string, unknown>
  const candidates = [
    entity,
    entity.replace(/-/g, ''),
    entity.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()),
  ]

  if (entity.endsWith('s')) {
    candidates.push(entity.slice(0, -1))
  }

  for (const key of candidates) {
    if (Array.isArray(record[key])) return record[key] as unknown[]
  }

  const firstArray = Object.values(record).find(Array.isArray)
  return Array.isArray(firstArray) ? (firstArray as unknown[]) : null
}

function normalizeItem<T>(item: T, entity: string): T {
  if (!item || typeof item !== 'object') return item
  const record = { ...(item as Record<string, unknown>) }

  if (record.status === 'active') record.status = 'published'
  if (record.publishStatus === 'active') record.publishStatus = 'published'

  if (entity === 'services') {
    if (record.category === 'assessment') record.category = 'strategy'
    if (record.category === 'implementation') record.category = 'build'
    if (record.category === 'maintenance') record.category = 'support'

    if (Array.isArray(record.formatOptions)) {
      record.formatOptions = (record.formatOptions as unknown[]).map((value) =>
        value === 'onsite' ? 'onsite-ottawa' : value
      )
    }

    if (typeof record.pricingFrom === 'number') {
      record.pricingFrom = `CAD ${record.pricingFrom.toLocaleString('en-CA')}`
    }
  }

  return record as T
}

async function loadJSON<T>(locale: Locale, entity: string): Promise<T[]> {
  const tryLoad = async (targetLocale: Locale): Promise<T[] | null> => {
    try {
      const raw = (await import(`@/content/${targetLocale}/${entity}/index.json`)).default
      const normalized = normalizeArrayPayload(raw, entity)
      if (!normalized) return null

      const items = normalized.map((item) => normalizeItem<T>(item as T, entity))
      if (targetLocale !== 'en' && items.length === 0) return null

      return items
    } catch {
      return null
    }
  }

  const local = await tryLoad(locale)
  if (local) return local

  if (locale !== 'en') {
    const fallback = await tryLoad('en')
    if (fallback) return fallback
  }

  return []
}

// ── Services ──────────────────────────────────────────────────────────────────

export async function getServices(locale: Locale = 'en'): Promise<Service[]> {
  const services = await loadJSON<Service>(locale, 'services')
  return services
    .filter((s) => s.status === 'published')
    .sort((a, b) => a.orderIndex - b.orderIndex)
}

export async function getService(slug: string, locale: Locale = 'en'): Promise<Service | null> {
  const services = await loadJSON<Service>(locale, 'services')
  return services.find((s) => s.slug === slug && s.status === 'published') ?? null
}

export async function getFeaturedServices(locale: Locale = 'en'): Promise<Service[]> {
  const services = await getServices(locale)
  return services.filter((s) => s.featured)
}

// ── Use Cases ─────────────────────────────────────────────────────────────────

export async function getUseCases(locale: Locale = 'en'): Promise<UseCase[]> {
  return loadJSON<UseCase>(locale, 'use-cases').then((uc) =>
    uc.filter((u) => u.status === 'published')
  )
}

export async function getUseCase(slug: string, locale: Locale = 'en'): Promise<UseCase | null> {
  const useCases = await loadJSON<UseCase>(locale, 'use-cases')
  return useCases.find((u) => u.slug === slug && u.status === 'published') ?? null
}

export async function getFeaturedUseCases(locale: Locale = 'en'): Promise<UseCase[]> {
  const useCases = await getUseCases(locale)
  return useCases.filter((u) => u.featured)
}

// ── Skills ────────────────────────────────────────────────────────────────────

export async function getSkills(locale: Locale = 'en'): Promise<Skill[]> {
  return loadJSON<Skill>(locale, 'skills').then((sk) =>
    sk.filter((s) => s.publishStatus === 'published')
  )
}

export async function getSkill(slug: string, locale: Locale = 'en'): Promise<Skill | null> {
  const skills = await loadJSON<Skill>(locale, 'skills')
  return skills.find((s) => s.slug === slug && s.publishStatus === 'published') ?? null
}

export async function getFeaturedSkills(locale: Locale = 'en'): Promise<Skill[]> {
  const skills = await getSkills(locale)
  return skills.filter((s) => s.featured)
}

// ── Templates ─────────────────────────────────────────────────────────────────

export async function getTemplates(locale: Locale = 'en'): Promise<Template[]> {
  return loadJSON<Template>(locale, 'templates').then((t) =>
    t.filter((tmpl) => tmpl.status === 'published')
  )
}

export async function getTemplate(slug: string, locale: Locale = 'en'): Promise<Template | null> {
  const templates = await loadJSON<Template>(locale, 'templates')
  return templates.find((t) => t.slug === slug && t.status === 'published') ?? null
}

// ── Resources ─────────────────────────────────────────────────────────────────

export async function getResources(locale: Locale = 'en'): Promise<Resource[]> {
  return loadJSON<Resource>(locale, 'resources').then((r) =>
    r
      .filter((res) => res.status === 'published')
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
  )
}

export async function getResource(slug: string, locale: Locale = 'en'): Promise<Resource | null> {
  const resources = await loadJSON<Resource>(locale, 'resources')
  return resources.find((r) => r.slug === slug && r.status === 'published') ?? null
}

// ── Cross-entity helpers ───────────────────────────────────────────────────────

export async function getRelatedServices(slugs: string[], locale: Locale = 'en'): Promise<Service[]> {
  const all = await getServices(locale)
  return all.filter((s) => slugs.includes(s.slug))
}

export async function getRelatedSkills(slugs: string[], locale: Locale = 'en'): Promise<Skill[]> {
  const all = await getSkills(locale)
  return all.filter((s) => slugs.includes(s.slug))
}

export async function getRelatedTemplates(slugs: string[], locale: Locale = 'en'): Promise<Template[]> {
  const all = await getTemplates(locale)
  return all.filter((t) => slugs.includes(t.slug))
}

export async function getRelatedUseCases(slugs: string[], locale: Locale = 'en'): Promise<UseCase[]> {
  const all = await getUseCases(locale)
  return all.filter((u) => slugs.includes(u.slug))
}
