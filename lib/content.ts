import type { Service, UseCase, Skill, Template, Resource } from '@/types/domain'

type Locale = 'en' | 'ru' | 'fr'

// ── Generic loader ────────────────────────────────────────────────────────────

async function loadJSON<T>(locale: Locale, entity: string): Promise<T[]> {
  try {
    // Use require for server-side JSON loading (works with Next.js)
    const data = (await import(`@/content/${locale}/${entity}/index.json`)).default
    return data as T[]
  } catch {
    // Fallback to 'en' if locale not available
    if (locale !== 'en') {
      try {
        const data = (await import(`@/content/en/${entity}/index.json`)).default
        return data as T[]
      } catch {
        return []
      }
    }
    return []
  }
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
