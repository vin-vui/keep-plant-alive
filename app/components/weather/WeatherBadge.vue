<template>
  <div
    v-if="snapshot"
    class="flex items-center gap-1 text-xs"
    :style="{ color: 'var(--c-accent2-text)', fontFamily: 'var(--font-data)' }"
  >
    <Icon :name="weatherIcon" class="text-base shrink-0" />
    <span>{{ snapshot.tempCelsius }}°</span>
  </div>
</template>

<script setup lang="ts">
const settingsStore = useSettingsStore()
const snapshot = computed(() => settingsStore.weatherSnapshot)

const WEATHER_ICONS: Record<string, string> = {
  Clear:        'streamline:brightness-1',
  Clouds:       'streamline:interface-weather-cloud-1-cloud-meteorology-cloudy-overcast-cover-weather',
  Rain:         'streamline:interface-weather-rain-1-cloud-rain-rainy-meteorology-precipitation-weather',
  Drizzle:      'streamline:interface-weather-rain-2-cloud-rain-rainy-meteorology-precipitation-weather',
  Thunderstorm: 'streamline:interface-weather-lightning-1-cloud-bolt-storm-weather-thunder-meteorology-lightning',
  Snow:         'streamline:interface-weather-snow-1-cloud-snow-snowfall-overcast-weather-precipitation-meteorology',
  Mist:         'streamline:interface-weather-cloud-2-cloud-meteorology-cloudy-overcast-cover-weather',
  Fog:          'streamline:interface-weather-cloud-2-cloud-meteorology-cloudy-overcast-cover-weather',
}

const weatherIcon = computed(() =>
  WEATHER_ICONS[snapshot.value?.conditionMain ?? ''] ?? 'streamline:interface-weather-celsius-degrees-temperature-centigrade-celsius-degree-weather'
)
</script>
