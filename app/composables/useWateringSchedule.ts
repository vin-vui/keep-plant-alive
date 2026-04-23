import { shouldSkipDueToRain, getWateringUrgency, computeNextWatering } from '~/utils/wateringLogic'
import type { Plant, WateringUrgency } from '~/types'

export function useWateringSchedule() {
  const plantsStore = usePlantsStore()
  const settingsStore = useSettingsStore()

  async function water(plantId: string) {
    const plant = plantsStore.plants.find(p => p.id === plantId)
    if (!plant) return

    const skip = shouldSkipDueToRain(settingsStore.weatherSnapshot, settingsStore.rainSkipThresholdMm)
    const now = new Date().toISOString()
    await plantsStore.updatePlant(plantId, {
      lastWateredAt: now,
      nextWateringAt: computeNextWatering(now, plant.wateringProfile.intervalDays),
      skippedDueToRain: skip
    })
  }

  function urgency(plant: Plant): WateringUrgency {
    return getWateringUrgency(plant)
  }

  return { water, urgency }
}
