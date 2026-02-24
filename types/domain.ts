// ============================================================
// Core Domain Types for OpenClaw Consulting Portal
// ============================================================

export type FormatOption = 'remote' | 'onsite-ottawa' | 'hybrid' | 'async'
export type ServiceCategory =
  | 'strategy'
  | 'setup'
  | 'security'
  | 'build'
  | 'support'
  | 'training'
  | 'onsite'
export type PricingModel = 'fixed' | 'range' | 'hourly' | 'retainer' | 'custom'
export type ComplexityLevel = 'low' | 'medium' | 'high'
export type SkillStatus = 'draft' | 'beta' | 'stable' | 'deprecated'
export type SkillComplexity = 'L1' | 'L2' | 'L3'
export type DataSensitivity = 'public' | 'internal' | 'confidential' | 'restricted'
export type CapabilityType =
  | 'research'
  | 'extraction'
  | 'reporting'
  | 'monitoring'
  | 'enrichment'
  | 'orchestration'
  | 'drafting'
  | 'parsing'
  | 'scheduling'
export type FunctionCategory =
  | 'founder'
  | 'sales'
  | 'ops'
  | 'marketing'
  | 'recruiting'
  | 'finance-admin'
export type ResourceCategory =
  | 'how-to'
  | 'troubleshooting'
  | 'strategy'
  | 'security'
  | 'case-study'
  | 'anti-pattern'
export type ContentStatus = 'draft' | 'published'

// ---- Service ------------------------------------------------
export interface ProcessStep {
  title: string
  description: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface Service {
  id: string
  slug: string
  title: string
  shortDescription: string
  category: ServiceCategory
  audience: string[]
  problemStatement: string
  outcomes: string[]
  scopeItems: string[]
  deliverables: string[]
  processSteps: ProcessStep[]
  durationText: string
  formatOptions: FormatOption[]
  pricingFrom: string
  pricingModel: PricingModel
  prerequisites: string[]
  exclusions: string[]
  faq: FAQ[]
  relatedUseCases: string[]
  relatedSkills: string[]
  relatedTemplates: string[]
  ctaPrimary: string
  ctaSecondary?: string
  featured: boolean
  orderIndex: number
  status: ContentStatus
  seoTitle?: string
  seoDescription?: string
}

// ---- UseCase ------------------------------------------------
export interface WorkflowStep {
  step: number
  action: string
}

export interface UseCase {
  id: string
  slug: string
  title: string
  summary: string
  functionCategory: FunctionCategory
  industryCategory?: string
  rolePersona: string
  painPoints: string[]
  solutionConcept: string
  typicalWorkflow: WorkflowStep[]
  expectedImpact: string[]
  implementationComplexity: ComplexityLevel
  timelineEstimate: string
  humanApprovalPoints: string[]
  securityNotes: string[]
  recommendedServices: string[]
  recommendedSkills: string[]
  recommendedTemplates: string[]
  featured: boolean
  status: ContentStatus
  seoTitle?: string
  seoDescription?: string
}

// ---- Skill --------------------------------------------------
export interface Skill {
  id: string
  slug: string
  name: string
  version: string
  status: SkillStatus
  shortDescription: string
  capabilityType: CapabilityType
  tags: string[]
  complexity: SkillComplexity
  prerequisites: string[]
  inputs: string[]
  outputs: string[]
  compatibleTemplates: string[]
  useCases: string[]
  dataSensitivityLevel: DataSensitivity
  requiresHumanApproval: boolean
  knownLimitations: string[]
  changelogSummary: string
  documentationSnippet?: string
  doneForYouAvailable: boolean
  featured: boolean
  publishStatus: ContentStatus
  seoTitle?: string
  seoDescription?: string
}

// ---- Template / Blueprint -----------------------------------
export interface IncludedSkill {
  skillSlug: string
  order: number
  note?: string
}

export interface WorkflowStage {
  stage: string
  description: string
}

export interface Template {
  id: string
  slug: string
  title: string
  version: string
  summary: string
  targetAudience: string[]
  industryFit: string[]
  goals: string[]
  includedSkills: IncludedSkill[]
  workflowStages: WorkflowStage[]
  deploymentFormats: FormatOption[]
  timeline: string
  pricingFrom: string
  complexity: ComplexityLevel
  prerequisites: string[]
  deliverables: string[]
  guardrails: string[]
  successMetrics: string[]
  relatedServices: string[]
  relatedUseCases: string[]
  featured: boolean
  status: ContentStatus
  seoTitle?: string
  seoDescription?: string
}

// ---- Resource / Article ------------------------------------
export interface Resource {
  slug: string
  title: string
  excerpt: string
  content?: string
  category: ResourceCategory
  tags: string[]
  author: string
  publishDate: string
  updatedDate?: string
  readTime: number
  featuredImage?: string
  relatedServices: string[]
  relatedUseCases: string[]
  status: ContentStatus
  seoTitle?: string
  seoDescription?: string
}

// ---- Lead / Inquiry -----------------------------------------
export interface LeadInquiry {
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
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  honeypot?: string
}

// ---- Navigation / Filters ----------------------------------
export interface FilterOption {
  label: string
  value: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

// ---- Site Settings -----------------------------------------
export interface SiteSettings {
  companyName: string
  tagline: string
  description: string
  primaryCtaText: string
  primaryCtaUrl: string
  contactEmail: string
  phone?: string
  serviceArea: string
  socialLinks: {
    linkedin?: string
    twitter?: string
    github?: string
  }
  bookingUrl: string
}
