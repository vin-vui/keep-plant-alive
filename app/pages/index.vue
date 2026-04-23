<template>
  <div>
    <!-- Rain skip banner -->
    <div
      v-if="rainSkipActive"
      class="mx-4 mt-4 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300"
    >
      <span>🌧️</span>
      <span>{{ $t('weather.skip_active') }}</span>
    </div>

    <PlantGrid :plants="sortedPlants" @water="handleWater" />
  </div>
</template>

<script setup lang="ts">
import { shouldSkipDueToRain } from '~/utils/wateringLogic'

const plantsStore = usePlantsStore()
const settingsStore = useSettingsStore()
const { water } = useWateringSchedule()
const { refresh: refreshWeather } = useWeather()
const { show: showToast } = useToast()
const { t } = useI18n()

const sortedPlants = computed(() => plantsStore.sortedPlants)

const rainSkipActive = computed(() =>
  shouldSkipDueToRain(settingsStore.weatherSnapshot, settingsStore.rainSkipThresholdMm)
)

async function handleWater(plantId: string) {
  await water(plantId)
  showToast(t('plants.watered'))
}

// Refresh weather in background on mount
onMounted(() => {
  if (settingsStore.locationLat !== null) {
    refreshWeather()
  }
})
</script>
