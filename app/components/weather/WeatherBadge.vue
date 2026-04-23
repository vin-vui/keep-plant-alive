<template>
  <div v-if="snapshot" class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
    <span>{{ weatherIcon }}</span>
    <span>{{ snapshot.tempCelsius }}°</span>
    <span v-if="snapshot.rainLast24hMm > 0" class="text-blue-500">
      {{ $t('weather.rain_24h', { mm: snapshot.rainLast24hMm }) }}
    </span>
  </div>
</template>

<script setup lang="ts">
const settingsStore = useSettingsStore()
const snapshot = computed(() => settingsStore.weatherSnapshot)

const WEATHER_ICONS: Record<string, string> = {
  Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️',
  Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️'
}

const weatherIcon = computed(() =>
  WEATHER_ICONS[snapshot.value?.conditionMain ?? ''] ?? '🌡️'
)
</script>
