export interface WateringProfile {
  intervalDays: number
  preferredTimeHour: number
}

export interface Plant {
  id: string
  name: string
  scientificName: string | null
  commonName: string | null
  family: string | null
  photoDataUrl: string | null
  thumbnailDataUrl: string | null
  wateringProfile: WateringProfile
  lastWateredAt: string | null
  nextWateringAt: string | null
  isOutdoor: boolean
  skippedDueToRain: boolean
  createdAt: string
  updatedAt: string
}

export interface WeatherSnapshot {
  fetchedAt: string
  lat: number
  lon: number
  rainLast24hMm: number
  rainForecast48hMm: number
  conditionMain: string
  tempCelsius: number
}

export interface AppSettings {
  locationLat: number | null
  locationLon: number | null
  locationName: string | null
  rainSkipThresholdMm: number
  notificationsEnabled: boolean
  theme: 'light' | 'dark' | 'system'
  weatherSnapshot: WeatherSnapshot | null
  weatherFetchedAt: string | null
}

export type WateringUrgency = 'overdue' | 'today' | 'soon' | 'ok'

export interface PlantIdResult {
  scientificName: string
  commonNames: string[]
  family: string | null
  score: number
  imageUrl: string | null
}
