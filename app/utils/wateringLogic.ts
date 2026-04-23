import type { Plant, WeatherSnapshot, WateringUrgency } from '~/types'
import { differenceInCalendarDays, addDays } from 'date-fns'

export function shouldSkipDueToRain(
  weather: WeatherSnapshot | null,
  thresholdMm = 5
): boolean {
  if (!weather) return false
  return weather.rainLast24hMm >= thresholdMm || weather.rainForecast48hMm >= thresholdMm
}

export function getWateringUrgency(plant: Plant): WateringUrgency {
  if (!plant.nextWateringAt) return 'ok'
  const daysUntil = differenceInCalendarDays(new Date(plant.nextWateringAt), new Date())
  if (daysUntil < 0) return 'overdue'
  if (daysUntil === 0) return 'today'
  if (daysUntil <= 2) return 'soon'
  return 'ok'
}

export function computeNextWatering(lastWateredAt: string, intervalDays: number): string {
  return addDays(new Date(lastWateredAt), intervalDays).toISOString()
}

export function urgencyBadgeClass(urgency: WateringUrgency): string {
  return {
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    today:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    soon:    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    ok:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  }[urgency]
}

export function urgencyRingColor(urgency: WateringUrgency): string {
  return {
    overdue: '#ef4444',
    today:   '#f59e0b',
    soon:    '#eab308',
    ok:      '#16a34a',
  }[urgency]
}
