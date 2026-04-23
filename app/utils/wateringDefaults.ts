import type { WateringProfile } from '~/types'

const FAMILY_PROFILES: Record<string, WateringProfile> = {
  Cactaceae:    { intervalDays: 14, preferredTimeHour: 8 },
  Succulent:    { intervalDays: 10, preferredTimeHour: 8 },
  Orchidaceae:  { intervalDays: 7,  preferredTimeHour: 8 },
  Poaceae:      { intervalDays: 3,  preferredTimeHour: 7 },
  Araceae:      { intervalDays: 7,  preferredTimeHour: 8 },
  Bromeliaceae: { intervalDays: 10, preferredTimeHour: 8 },
  Ficus:        { intervalDays: 7,  preferredTimeHour: 8 },
  Rosaceae:     { intervalDays: 4,  preferredTimeHour: 8 },
  Lamiaceae:    { intervalDays: 3,  preferredTimeHour: 7 },
}

const DEFAULT_PROFILE: WateringProfile = { intervalDays: 7, preferredTimeHour: 8 }

export function getDefaultWateringProfile(family: string | null): WateringProfile {
  if (!family) return DEFAULT_PROFILE
  for (const [key, profile] of Object.entries(FAMILY_PROFILES)) {
    if (family.includes(key)) return { ...profile }
  }
  return { ...DEFAULT_PROFILE }
}

export const INTERVAL_OPTIONS = [1, 2, 3, 4, 5, 7, 10, 14, 21, 30]
