<template>
  <!-- Loading skeleton -->
  <div
    v-if="loading && !snapshot"
    class="mx-4 mt-1 rounded-2xl p-4 flex items-center gap-3"
    :style="{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }"
  >
    <AppSpinner size="sm" color="text-brand-500" />
    <span class="text-xs uppercase tracking-wider" :style="{ color: 'var(--c-muted)' }">
      {{ $t('common.loading') }}
    </span>
  </div>

  <div
    v-else-if="snapshot"
    class="mx-4 mt-1 rounded-2xl px-4 py-2 fade-in"
    :style="{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }"
  >
    <!-- Top row: city + condition + temp -->
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0">
        <p
          v-if="locationName"
          class="text-xs uppercase tracking-widest truncate mb-0.5"
          :style="{ color: 'var(--c-muted)' }"
        >
          {{ locationName }}
        </p>
        <div class="flex items-center gap-2">
          <Icon :name="weatherIcon" class="text-2xl shrink-0" :style="{ color: 'var(--c-accent2-text)' }" />
          <span
            class="text-xl font-semibold mt-1"
            :style="{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }"
          >
            {{ snapshot.tempCelsius }}°C
          </span>
        </div>
      </div>

      <!-- Rain indicators -->
      <div class="shrink-0 flex flex-col items-end gap-0.5 text-xs">
        <div :style="{ color: snapshot.rainLast24hMm > 0 ? 'var(--c-accent2-text)' : 'var(--c-muted)' }">
          {{ rainPastLabel }} <span :style="{ fontFamily: 'var(--font-data)' }">{{ snapshot.rainLast24hMm }} mm</span>
        </div>
        <div :style="{ color: snapshot.rainForecast48hMm > 0 ? 'var(--c-accent2-text)' : 'var(--c-muted)' }">
          {{ rainForecastLabel }} <span :style="{ fontFamily: 'var(--font-data)' }">{{ snapshot.rainForecast48hMm }} mm</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const settingsStore = useSettingsStore()
const { loading }   = useWeather()
const snapshot      = computed(() => settingsStore.weatherSnapshot)
const locationName  = computed(() => settingsStore.locationName)

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
  WEATHER_ICONS[snapshot.value?.conditionMain ?? '']
  ?? 'streamline:interface-weather-celsius-degrees-temperature-centigrade-celsius-degree-weather'
)

const RAIN_PAST_LABELS: Record<string, string> = {
  fr: 'Pluie tombée ',
  en: 'Rainfall:',
}
const RAIN_FORECAST_LABELS: Record<string, string> = {
  fr: 'Pluie prévue ',
  en: 'Rain forecast:',
}
const rainPastLabel = computed(() => RAIN_PAST_LABELS[locale.value] ?? RAIN_PAST_LABELS.fr)
const rainForecastLabel = computed(() => RAIN_FORECAST_LABELS[locale.value] ?? RAIN_FORECAST_LABELS.fr)
</script>
