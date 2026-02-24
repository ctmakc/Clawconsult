# OpenClaw Consulting Portal

Production website for **OpenClaw Consulting** — AI agent implementation for SMB and professional services.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **next-intl** (EN/RU, FR-ready).

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS + class-variance-authority |
| i18n | next-intl (EN, RU; FR-ready) |
| UI primitives | Radix UI + Lucide icons |
| Validation | Zod |
| Forms | React controlled forms + fetch API |
| SEO | Next.js Metadata API + JSON-LD |
| Analytics | Google Analytics (GA4, optional) |

---

## Project Structure

```
app/
  [locale]/           # All pages (EN/RU/FR)
    page.tsx          # Homepage
    services/         # Service catalog + detail pages
    use-cases/        # Use case library + detail pages
    skills/           # Skills library + detail pages
    templates/        # Agent blueprints + detail pages
    security/         # Security & governance page
    pricing/          # Pricing table
    training/         # Training & workshops
    about/            # About page
    resources/        # Articles index + detail pages
    contact/          # Discovery session form
    thank-you/        # Post-submission page
    privacy/          # Privacy policy
    terms/            # Terms of service
  api/
    contact/          # Form submission API (rate limiting, honeypot, webhook)
  sitemap.ts          # Auto-generated sitemap
  robots.ts           # robots.txt

components/
  layout/             # Header, Footer, LocaleSwitcher, CookieBanner, Analytics
  ui/                 # Button, Badge, Card, Input, Textarea, Select, Checkbox, Accordion
  cards/              # ServiceCard, UseCaseCard, SkillCard, TemplateCard, ResourceCard
  sections/           # CtaSection, FaqSection, FilterBar, RelatedContent
  forms/              # ContactForm (full validation, UTM capture, honeypot)

content/
  en/                 # English JSON content
  ru/                 # Russian JSON content
    services/         # 12 services
    use-cases/        # 20 use cases
    skills/           # 15 skills
    templates/        # 5 agent blueprints
    resources/        # 5 articles

lib/
  content.ts          # Data loading helpers
  seo.ts              # Metadata builders + JSON-LD schemas
  utils.ts            # cn(), formatDate(), truncate(), absoluteUrl()
  analytics.ts        # GA4 event tracking helpers

messages/
  en.json             # English UI strings
  ru.json             # Russian UI strings

i18n/
  routing.ts          # Locale configuration
  request.ts          # Server-side message loading
  navigation.ts       # Typed Link/router wrappers

types/
  domain.ts           # All domain types (Service, UseCase, Skill, Template, Resource)
```

---

## Getting Started

```bash
# Clone and install
npm install

# Configure environment
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SITE_URL and optionally CONTACT_WEBHOOK_URL

# Dev server
npm run dev
# → http://localhost:3000
# → EN: http://localhost:3000/en
# → RU: http://localhost:3000/ru

# Build
npm run build
npm run start
```

---

## Environment Variables

See `.env.example` for all variables. Required for production:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical domain for SEO + sitemap |
| `CONTACT_WEBHOOK_URL` | Slack/Zapier webhook for form notifications |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics (optional) |

---

## Content Management

All content is JSON files in `content/[locale]/`. To update:

1. Edit `content/en/services/index.json` (or use-cases, skills, templates, resources)
2. Edit `content/ru/` for Russian translations
3. Deploy — no database required

---

## i18n

- Default locale: `en` (all URLs are `/en/...`, `/ru/...`)
- To add French: add `fr` to `i18n/routing.ts` locales and create `content/fr/` + `messages/fr.json`

---

## Form Submissions

The contact form (`/api/contact`) includes:
- **Zod validation** of all fields
- **Honeypot** anti-spam field (hidden input)
- **Rate limiting** (5 requests/IP/hour, in-memory)
- **Webhook notification** to Slack/Zapier/Make via `CONTACT_WEBHOOK_URL`
- **UTM parameter capture** for attribution

---

## SEO

- All pages have `Metadata` with `title`, `description`, `og:*`, `twitter:*`
- JSON-LD schemas: `Organization`, `Service`, `Article`, `FAQPage`, `BreadcrumbList`
- Auto-generated `sitemap.xml` and `robots.txt`
- Hreflang alternates on all pages

---

## Security Headers

Configured in `next.config.ts`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
