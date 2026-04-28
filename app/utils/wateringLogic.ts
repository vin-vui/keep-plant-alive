import type { Plant, WeatherSnapshot } from '~/types'

export type WateringUrgency = 'overdue' | 'today' | 'soon' | 'ok'

export function getWateringUrgency(plant: Plant): WateringUrgency {
  const days = daysUntilWatering(plant)
  if (days < 0)  return 'overdue'
  if (days === 0) return 'today'
  if (days <= 2)  return 'soon'
  return 'ok'
}

function daysUntilWatering(plant: Plant): number {
  if (!plant.nextWateringAt) return 0
  const diff = new Date(plant.nextWateringAt).getTime() - Date.now()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function urgencyBadgeClass(_urgency: WateringUrgency): string {
  return ''
}

export function urgencyBadgeStyle(urgency: WateringUrgency): string {
  return {
    overdue: 'background:var(--urgency-overdue-bg);border:1px solid var(--urgency-overdue-border);color:var(--urgency-overdue-text)',
    today:   'background:var(--urgency-today-bg);border:1px solid var(--urgency-today-border);color:var(--urgency-today-text)',
    soon:    'background:var(--urgency-soon-bg);border:1px solid var(--urgency-soon-border);color:var(--urgency-soon-text)',
    ok:      'background:var(--urgency-ok-bg);border:1px solid var(--urgency-ok-border);color:var(--urgency-ok-text)',
  }[urgency]
}

export function urgencyRingColor(urgency: WateringUrgency): string {
  return {
    overdue: 'var(--urgency-overdue-text)',
    today:   'var(--urgency-today-text)',
    soon:    'var(--urgency-soon-text)',
    ok:      'var(--urgency-ok-text)',
  }[urgency]
}

export function computeNextWatering(lastWatered: string, intervalDays: number): string {
  const d = new Date(lastWatered)
  d.setDate(d.getDate() + intervalDays)
  return d.toISOString()
}

export function shouldSkipDueToRain(
  weather: WeatherSnapshot | null,
  thresholdMm = 5,
  isOutdoor = true
): boolean {
  if (!isOutdoor) return false
  if (!weather) return false
  return weather.rainLast24hMm >= thresholdMm || weather.rainForecast48hMm >= thresholdMm
}
