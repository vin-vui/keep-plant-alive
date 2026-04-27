<template>
  <div class="max-w-lg mx-auto px-4 py-6 space-y-6">
    <h1 class="text-xl font-bold">{{ $t('settings.title') }}</h1>

    <!-- Location -->
    <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
      <h2 class="font-semibold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        {{ $t('settings.location') }}
      </h2>

      <button
        class="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors"
        :disabled="detectingLocation"
        @click="detectLocation"
      >
        <AppSpinner v-if="detectingLocation" size="sm" color="text-white" />
        <span v-else>📍</span>
        {{ detectingLocation ? $t('common.loading') : $t('settings.detect_location') }}
      </button>

      <div
        v-if="settings.locationLat !== null"
        class="text-xs text-gray-500 dark:text-gray-400 text-center"
      >
        {{ settings.locationLat?.toFixed(4) }}, {{ settings.locationLon?.toFixed(4) }}
        <span v-if="weatherLoading"> · {{ $t('common.loading') }}</span>
      </div>

      <input
        v-model="locationName"
        type="text"
        class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
        :placeholder="$t('settings.location_name')"
        @blur="saveLocationName"
      />
    </section>

    <!-- Rain threshold -->
    <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
      <h2 class="font-semibold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        {{ $t('settings.rain_threshold') }}
      </h2>
      <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('settings.rain_threshold_hint') }}</p>
      <div class="flex items-center gap-3">
        <input
          v-model.number="rainThreshold"
          type="range"
          min="1"
          max="30"
          step="1"
          class="flex-1 accent-brand-600"
          @change="saveRainThreshold"
        />
        <span class="w-12 text-sm font-semibold text-right">{{ rainThreshold }} mm</span>
      </div>
    </section>

    <!-- Notifications -->
    <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
      <h2 class="font-semibold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        {{ $t('settings.notifications') }}
      </h2>
      <button
        class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-colors"
        :class="settings.notificationsEnabled
          ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
        @click="toggleNotifications"
      >
        <span>{{ settings.notificationsEnabled ? '🔔' : '🔕' }}</span>
        {{ $t('settings.enable_notifications') }}
      </button>
    </section>

    <!-- Theme -->
    <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
      <h2 class="font-semibold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        {{ $t('settings.theme') }}
      </h2>
      <div class="flex gap-2">
        <button
          v-for="opt in themeOptions"
          :key="opt.value"
          class="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
          :class="settings.theme === opt.value
            ? 'bg-brand-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
          @click="setTheme(opt.value as 'light' | 'dark' | 'system')"
        >
          {{ $t(opt.label) }}
        </button>
      </div>
    </section>

    <!-- Language -->
    <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
      <h2 class="font-semibold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        {{ $t('settings.language') }}
      </h2>
      <div class="flex gap-2">
        <button
          v-for="lang in ['fr', 'en']"
          :key="lang"
          class="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
          :class="locale === lang
            ? 'bg-brand-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
          @click="setLocale(lang)"
        >
          {{ lang === 'fr' ? '🇫🇷 Français' : '🇬🇧 English' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const settings = useSettingsStore()
const { requestPermission, scheduleAll } = useNotifications()
const { fetchWeather } = useWeather()
const { show: showToast } = useToast()
const { t, locale, setLocale } = useI18n()

const detectingLocation = ref(false)
const weatherLoading = ref(false)
const locationName = ref(settings.locationName ?? '')
const rainThreshold = ref(settings.rainSkipThresholdMm)

const themeOptions = [
  { value: 'light',  label: 'settings.theme_light' },
  { value: 'dark',   label: 'settings.theme_dark' },
  { value: 'system', label: 'settings.theme_system' }
]

async function detectLocation() {
  detectingLocation.value = true
  try {
    const pos = await settings.detectLocation()
    if (pos) {
      showToast(t('settings.location_detected'))
      // Reverse geocoding and weather run in background — don't block the button
      resolveCity(pos.lat, pos.lon)
      weatherLoading.value = true
      fetchWeather(pos.lat, pos.lon).finally(() => { weatherLoading.value = false })
    }
  } finally {
    detectingLocation.value = false
  }
}

async function resolveCity(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'Accept-Language': locale.value }, signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) return
    const data = await res.json()
    const city = data.address?.city ?? data.address?.town ?? data.address?.village ?? data.address?.county ?? ''
    if (city) {
      locationName.value = city
      await settings.update({ locationName: city })
    }
  } catch {}
}

async function saveLocationName() {
  await settings.update({ locationName: locationName.value || null })
}

async function saveRainThreshold() {
  await settings.update({ rainSkipThresholdMm: rainThreshold.value })
}

async function toggleNotifications() {
  if (settings.notificationsEnabled) {
    await settings.update({ notificationsEnabled: false })
  } else {
    const granted = await requestPermission()
    if (granted) await scheduleAll()
  }
}

async function setTheme(theme: 'light' | 'dark' | 'system') {
  await settings.update({ theme })
}
</script>
