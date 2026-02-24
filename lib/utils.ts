import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatDate(dateStr: string, locale: string = 'en'): string {
  return new Date(dateStr).toLocaleDateString(
    locale === 'ru' ? 'ru-RU' : 'en-CA',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).replace(/\s+\S*$/, '') + '…'
}

export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://openclaw.ca'
  return `${base}${path}`
}
