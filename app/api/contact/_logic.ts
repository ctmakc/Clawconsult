import { z } from 'zod'

export const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(100),
  website: z.string().url().or(z.literal('')).optional(),
  country: z.string().min(1).max(100),
  city: z.string().optional(),
  companySize: z.string().min(1),
  industry: z.string().min(1).max(100),
  interestType: z.string().min(1),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  currentSituation: z.string().min(10).max(2000),
  goals: z.string().min(10).max(2000),
  preferredFormat: z.string().optional(),
  consent: z.literal(true),
  website_url: z.string().max(0).optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
  utm_term: z.string().optional(),
  service: z.string().optional(),
  skill: z.string().optional(),
  template: z.string().optional(),
  usecase: z.string().optional(),
  turnstileToken: z.string().optional(),
})

export type ContactFormData = z.infer<typeof ContactSchema>

const rateLimitMap = new Map<string, { count: number; reset: number }>()

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000
  const maxRequests = 5

  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + windowMs })
    return true
  }
  if (entry.count >= maxRequests) return false
  entry.count++
  return true
}

export function resetContactRateLimitForTests() {
  rateLimitMap.clear()
}
