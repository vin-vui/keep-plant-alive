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

export const useSettingsStore = defineStore('settings', {
  state: (): AppSettings => ({ ...defaults }),

  actions: {
    async load() {
      const stored = await get<AppSettings>(IDB_KEY)
      if (stored) Object.assign(this, stored)
    },

    async save() {
      await set(IDB_KEY, this.$state)
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
      return new Promise((resolve) => {
        if (!navigator.geolocation) { resolve(null); return }
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude
            const lon = pos.coords.longitude
            await this.update({ locationLat: lat, locationLon: lon })
            resolve({ lat, lon })
          },
          () => resolve(null),
          { timeout: 10000 }
        )
      })
    }
  }
})
