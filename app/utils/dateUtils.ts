import { formatDistanceToNow, format, differenceInCalendarDays } from 'date-fns'
import { fr, enUS } from 'date-fns/locale'

const LOCALES = { fr, en: enUS }

function getLocale(lang: string) {
  return LOCALES[lang as keyof typeof LOCALES] ?? enUS
}

export function formatRelative(date: string | null, lang = 'fr'): string {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: getLocale(lang) })
}

export function formatShortDate(date: string | null, lang = 'fr'): string {
  if (!date) return ''
  return format(new Date(date), 'dd MMM', { locale: getLocale(lang) })
}

export function daysUntil(date: string | null): number {
  if (!date) return 0
  return differenceInCalendarDays(new Date(date), new Date())
}
