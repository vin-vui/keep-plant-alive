<template>
  <div>
    <WeatherCard />

    <!-- Rain skip banner -->
    <div
      v-if="rainSkipActive"
      class="mx-4 mt-1 px-4 py-3 rounded-xl flex items-center gap-2 text-sm fade-in"
      :style="{
        background: 'var(--c-deep)',
        border: '1px solid var(--c-accent2-text)',
        color: 'var(--c-accent2-text)',
      }"
    >
      <Icon name="streamline:interface-weather-rain-1-cloud-rain-rainy-meteorology-precipitation-weather" />
      <span class="uppercase tracking-wider">{{ $t('weather.skip_active') }}</span>
    </div>

    <PlantGrid :plants="sortedPlants" @water="handleWater" />
  </div>
</template>

<script setup lang="ts">
import { shouldSkipDueToRain } from '~/utils/wateringLogic'

const plantsStore    = usePlantsStore()
const settingsStore  = useSettingsStore()
const { water }      = useWateringSchedule()
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

</script>
