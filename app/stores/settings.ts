import { defineStore } from 'pinia'
import { get, set } from 'idb-keyval'
import type { AppSettings, WeatherSnapshot } from '~/types'

const IDB_KEY = 'kpa:settings'

const defaults: AppSettings = {
  locationLat: null,
  locationLon: null,
  locationName: null,
  rainSkipThresholdMm: 5,
  notificationsEnabled: false,
  theme: 'system',
  weatherSnapshot: null,
  weatherFetchedAt: null
}

// Module-level ref: transient, not persisted to IDB
const _locationDetecting = ref(false)

export const useSettingsStore = defineStore('settings', {
  state: (): AppSettings => ({ ...defaults }),

  getters: {
    locationDetecting: () => _locationDetecting.value
  },

  actions: {
    async load() {
      const stored = await get<AppSettings>(IDB_KEY)
      if (stored) Object.assign(this, stored)
    },

    async save() {
      await set(IDB_KEY, JSON.parse(JSON.stringify(this.$state)))
    },

    async update(updates: Partial<AppSettings>) {
      Object.assign(this, updates)
      await this.save()
    },

    async updateWeather(snapshot: WeatherSnapshot) {
      this.weatherSnapshot = snapshot
      this.weatherFetchedAt = new Date().toISOString()
      await this.save()
    },

    async detectLocation(): Promise<{ lat: number; lon: number } | null> {
      _locationDetecting.value = true
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          _locationDetecting.value = false
          resolve(null)
          return
        }
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude
            const lon = pos.coords.longitude
            await this.update({ locationLat: lat, locationLon: lon })
            _locationDetecting.value = false
            resolve({ lat, lon })
          },
          () => {
            _locationDetecting.value = false
            resolve(null)
          },
          { timeout: 10000 }
        )
      })
    },

    async resolveCity(lat: number, lon: number, lang = 'fr'): Promise<string | null> {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
          { headers: { 'Accept-Language': lang }, signal: AbortSignal.timeout(6000) }
        )
        if (!res.ok) return null
        const data = await res.json()
        const city = data.address?.city ?? data.address?.town ?? data.address?.village ?? data.address?.county ?? null
        if (city) await this.update({ locationName: city })
        return city
      } catch { return null }
    }
  }
})
