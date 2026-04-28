<template>
  <div>
    <!-- Top bar: title + weather -->
    <div class="flex items-center justify-between px-4 pt-10 pb-2">
      <div class="flex items-center gap-2">
        <span class="text-2xl" aria-hidden>🌱</span>
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ $t('nav.home') }}</h1>
      </div>
      <WeatherBadge />
    </div>

    <!-- Rain skip banner -->
    <div
      v-if="rainSkipActive"
      class="mx-4 mt-1 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300"
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
  plantsStore.plants.some(p => p.isOutdoor) &&
  shouldSkipDueToRain(settingsStore.weatherSnapshot, settingsStore.rainSkipThresholdMm, true)
)

async function handleWater(plantId: string) {
  await water(plantId)
  showToast(t('plants.watered'))
}

onMounted(() => {
  if (settingsStore.locationLat !== null) refreshWeather()
})
</script>
