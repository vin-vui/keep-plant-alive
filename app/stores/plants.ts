import { defineStore } from 'pinia'
import { get, set } from 'idb-keyval'
import type { Plant } from '~/types'
import { computeNextWatering } from '~/utils/wateringLogic'

const IDB_KEY = 'kpa:plants'

export const usePlantsStore = defineStore('plants', {
  state: () => ({
    plants: [] as Plant[],
    loaded: false
  }),

  getters: {
    sortedPlants: (state): Plant[] =>
      [...state.plants].sort((a, b) => {
        const aTime = a.nextWateringAt ? new Date(a.nextWateringAt).getTime() : Infinity
        const bTime = b.nextWateringAt ? new Date(b.nextWateringAt).getTime() : Infinity
        return aTime - bTime
      })
  },

  actions: {
    async loadFromIDB() {
      const stored = await get<Plant[]>(IDB_KEY)
      if (stored) this.plants = stored.map(p => ({ isOutdoor: true, ...p }))
      this.loaded = true
    },

    async persist() {
      // Photos saved separately — strip to avoid per-key size limits
      const toSave = this.plants.map(p => ({ ...p, photoDataUrl: null }))
      await set(IDB_KEY, toSave)
    },

    async addPlant(data: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plant> {
      const now = new Date().toISOString()
      const plant: Plant = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
      if (plant.photoDataUrl) {
        await set(`kpa:photo:${plant.id}`, plant.photoDataUrl)
      }
      this.plants.push(plant)
      await this.persist()
      return plant
    },

    async updatePlant(id: string, updates: Partial<Plant>) {
      const idx = this.plants.findIndex(p => p.id === id)
      if (idx === -1) return
      this.plants[idx] = { ...this.plants[idx], ...updates, updatedAt: new Date().toISOString() }
      if (updates.photoDataUrl) {
        await set(`kpa:photo:${id}`, updates.photoDataUrl)
      }
      await this.persist()
    },

    async deletePlant(id: string) {
      this.plants = this.plants.filter(p => p.id !== id)
      await this.persist()
    },

    async waterPlant(id: string) {
      const plant = this.plants.find(p => p.id === id)
      if (!plant) return
      const now = new Date().toISOString()
      await this.updatePlant(id, {
        lastWateredAt: now,
        nextWateringAt: computeNextWatering(now, plant.wateringProfile.intervalDays),
        skippedDueToRain: false
      })
    },

    async getPhoto(id: string): Promise<string | null> {
      return (await get<string>(`kpa:photo:${id}`)) ?? null
    }
  }
})
