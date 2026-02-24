# OpenClaw Consulting Portal — Finalized Technical Specification

> Version 1.1 | Last updated: 2026-02-22
> Branch: `claude/openclaw-consulting-portal-CeoHI`

---

## 1. Project Summary

**Name:** OpenClaw Consulting Portal (Canada)
**Type:** B2B marketing portal + lead generation + service catalog + knowledge base
**Goal:** Sell consulting, setup, security, and AI agent implementation services (OpenClaw-based) to SMB and professional services companies in Canada and remotely worldwide.
**Location:** Ottawa, Ontario, Canada + Remote Worldwide

---

## 2. Positioning

> "We deploy production-ready autonomous AI agents for SMB and founder-led companies — securely, incrementally, with measurable business outcomes."

Key messages:
- Practical workflows, not hype
- Secure deployment and governance
- Done-for-you / done-with-you
- Fast pilot, measurable ROI
- SMB-friendly consulting
- Ottawa onsite + remote worldwide

---

## 3. Target Segments (Priority Order)

1. **Professional Services** — lawyers, accountants, consulting, recruiting, boutique agencies
2. **Marketing agencies / solo consultants / digital teams**
3. **Local SMB / Home services / clinics**
4. **Franchises / multi-unit SMB**

---

## 4. Tech Stack (Finalized)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict) |
| UI | Tailwind CSS + shadcn/ui (Radix UI) |
| i18n | next-intl (EN primary, RU secondary, FR-ready) |
| Content | JSON files + MDX (no external CMS for MVP) |
| Forms | React Hook Form + Zod + server actions |
| Email | Resend (abstracted behind provider interface) |
| CAPTCHA | Cloudflare Turnstile (stub/integration-ready) |
| Analytics | GA4 + custom events |
| SEO | next/metadata + schema.org helpers |
| Hosting | Vercel |
| Package manager | pnpm |

---

## 5. Multilingual Architecture (ADDED vs original TZ)

### Locales
- `en` — English (primary, default)
- `ru` — Russian (secondary)
- `fr` — French (architecture-ready, content TBD)

### Routing
- `/` → redirects to `/en` (default locale)
- `/en/...` — English pages
- `/ru/...` — Russian pages
- All routes: `/[locale]/services`, `/[locale]/use-cases`, etc.

### Implementation
- `next-intl` with `createSharedPathnamesNavigation`
- UI strings in `/messages/{locale}.json`
- Structured content in `/content/{locale}/` (JSON + MDX)
- Locale switcher in header navbar
- `hreflang` tags for SEO

### Content Approach
- All domain entities (services, use-cases, skills, templates) have locale-specific JSON files
- Blog/resources use MDX with frontmatter per locale
- Fallback to EN if RU translation missing

---

## 6. Brand Design Tokens

```
Primary background: #FFFFFF, #F8FAFC (slate-50)
Card background: #F1F5F9 (slate-100)
Primary text: #1E293B (slate-800)
Secondary text: #64748B (slate-500)
Accent (CTA): #2563EB (blue-600)
Accent hover: #1D4ED8 (blue-700)
Dark bg sections: #0F172A (slate-900)
Border: #E2E8F0 (slate-200)
Success: #10B981 (emerald-500)
Warning: #F59E0B (amber-500)

Typography: Inter (Google Fonts)
Heading scale: xl→5xl, font-bold/semibold
Body: text-base, leading-relaxed
```

No neon gradients. Clean, professional, structured.

---

## 7. Information Architecture

```
/[locale]/
├── (home)
├── services/
│   └── [slug]/
├── use-cases/
│   └── [slug]/
├── skills/
│   └── [slug]/
├── templates/
│   └── [slug]/
├── security/
├── pricing/
├── training/
├── about/
├── resources/
│   └── [slug]/
├── contact/
├── book-discovery/
├── thank-you/
├── privacy/
├── terms/
└── 404

/api/
├── contact/route.ts
├── lead/route.ts
└── webhook/route.ts (optional)

/sitemap.xml
/robots.txt
```

---

## 8. Domain Models

### Service
```typescript
interface Service {
  id: string
  slug: string
  title: string
  shortDescription: string
  category: 'strategy' | 'setup' | 'security' | 'build' | 'support' | 'training' | 'onsite'
  audience: string[]
  problemStatement: string
  outcomes: string[]
  scopeItems: string[]
  deliverables: string[]
  processSteps: Array<{ title: string; description: string }>
  durationText: string
  formatOptions: Array<'remote' | 'onsite-ottawa' | 'hybrid' | 'async'>
  pricingFrom: string
  pricingModel: 'fixed' | 'range' | 'hourly' | 'retainer' | 'custom'
  prerequisites: string[]
  exclusions: string[]
  faq: Array<{ question: string; answer: string }>
  relatedUseCases: string[] // slugs
  relatedSkills: string[]
  relatedTemplates: string[]
  ctaPrimary: string
  ctaSecondary?: string
  featured: boolean
  orderIndex: number
  seoTitle?: string
  seoDescription?: string
}
```

### UseCase
```typescript
interface UseCase {
  id: string
  slug: string
  title: string
  summary: string
  functionCategory: 'founder' | 'sales' | 'ops' | 'marketing' | 'recruiting' | 'finance-admin'
  industryCategory?: string
  rolePersona: string
  painPoints: string[]
  solutionConcept: string
  typicalWorkflow: Array<{ step: number; action: string }>
  expectedImpact: string[]
  implementationComplexity: 'low' | 'medium' | 'high'
  timelineEstimate: string
  humanApprovalPoints: string[]
  securityNotes: string[]
  recommendedServices: string[]
  recommendedSkills: string[]
  recommendedTemplates: string[]
  featured: boolean
  seoTitle?: string
  seoDescription?: string
}
```

### Skill
```typescript
interface Skill {
  id: string
  slug: string
  name: string
  version: string
  status: 'draft' | 'beta' | 'stable' | 'deprecated'
  shortDescription: string
  capabilityType: 'research' | 'extraction' | 'reporting' | 'monitoring' | 'enrichment' | 'orchestration' | 'drafting' | 'parsing' | 'scheduling'
  tags: string[]
  complexity: 'L1' | 'L2' | 'L3'
  prerequisites: string[]
  inputs: string[]
  outputs: string[]
  compatibleTemplates: string[]
  useCases: string[]
  dataSensitivityLevel: 'public' | 'internal' | 'confidential' | 'restricted'
  requiresHumanApproval: boolean
  knownLimitations: string[]
  changelogSummary: string
  documentationSnippet?: string
  doneForYouAvailable: boolean
  featured: boolean
  seoTitle?: string
  seoDescription?: string
}
```

### Template / Blueprint
```typescript
interface Template {
  id: string
  slug: string
  title: string
  version: string
  summary: string
  targetAudience: string[]
  industryFit: string[]
  goals: string[]
  includedSkills: Array<{ skillSlug: string; order: number; note?: string }>
  workflowStages: Array<{ stage: string; description: string }>
  deploymentFormats: string[]
  timeline: string
  pricingFrom: string
  complexity: 'low' | 'medium' | 'high'
  prerequisites: string[]
  deliverables: string[]
  guardrails: string[]
  successMetrics: string[]
  relatedServices: string[]
  relatedUseCases: string[]
  featured: boolean
  seoTitle?: string
  seoDescription?: string
}
```

### Resource / Article
```typescript
interface Resource {
  slug: string
  title: string
  excerpt: string
  category: 'how-to' | 'troubleshooting' | 'strategy' | 'security' | 'case-study' | 'anti-pattern'
  tags: string[]
  author: string
  publishDate: string
  updatedDate?: string
  readTime: number
  featuredImage?: string
  relatedServices: string[]
  relatedUseCases: string[]
  seoTitle?: string
  seoDescription?: string
}
```

### LeadInquiry
```typescript
interface LeadInquiry {
  name: string
  email: string
  company?: string
  role?: string
  website?: string
  country?: string
  city?: string
  companySize?: string
  industry?: string
  interestType: string[]
  budgetRange?: string
  timeline?: string
  currentSituation?: string
  goals?: string
  preferredFormat?: string
  consent: boolean
  sourcePage?: string
  sourceCampaign?: string
  honeypot?: string // must be empty
}
```

---

## 9. Seed Content Requirements (MVP minimum)

| Entity | EN | RU |
|--------|----|----|
| Services | 12 | 12 |
| Use Cases | 20 | 20 |
| Skills | 15 | 15 |
| Templates | 5 | 5 |
| Resources/Articles | 5 | 5 |

---

## 10. Pages & Key Blocks

See original TZ sections 7.1–7.16 for full page block specifications.

---

## 11. Compliance Additions

- **Cookie consent banner** (PIPEDA Canada + GDPR-aligned) — minimize, accept all, customize
- **Privacy Policy** — data collection, form submissions, analytics
- **Terms of Service** — consulting disclaimer, limitations
- **Disclaimer** — "risk reduction, not absolute guarantee" language in security pages

---

## 12. Acceptance Criteria (MVP)

- [ ] All routes accessible and linked
- [ ] EN + RU locale switching works
- [ ] Service/UseCase/Skill/Template catalogs with filters
- [ ] Detail pages render from JSON content
- [ ] Discovery form: validation, anti-spam, UTM capture, email notification
- [ ] SEO: meta, OG, schema, sitemap, robots
- [ ] Mobile responsive
- [ ] Production build: no TS errors, no lint errors
- [ ] .env.example provided
- [ ] README with setup/deploy instructions

---

## 13. Out of Scope (MVP)

- Client portal / auth
- Online payments / billing
- Skill marketplace with purchase flow
- Live agent dashboard
- Full forum/community

---

## 14. Roadmap

| Phase | Scope |
|-------|-------|
| MVP (this sprint) | Full public portal, catalogs, forms, SEO, EN+RU |
| Phase 2 | Client portal, auth, ROI calculator, gated downloads |
| Phase 3 | Skill marketplace, managed AgentOps dashboard, billing |
