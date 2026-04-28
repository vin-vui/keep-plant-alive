<template>
  <div class="max-w-lg mx-auto px-4 py-6 space-y-6 fade-in">

    <!-- Location -->
    <section class="rounded-2xl p-4 space-y-3 neon-card">
      <h2 class="font-semibold text-sm uppercase tracking-widest" :style="{ color: 'var(--c-muted)' }">
        {{ $t('settings.location') }}
      </h2>
      <button
        class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all uppercase tracking-widest neon-border"
        :style="{ background: 'var(--c-accent-bg)', color: 'var(--c-accent-text)' }"
        :disabled="detectingLocation"
        @click="detectLocation"
      >
        <AppSpinner v-if="detectingLocation" size="sm" color="text-brand-500" />
        <Icon v-else name="streamline:location-pin-3" />
        {{ detectingLocation ? $t('common.loading') : $t('settings.detect_location') }}
      </button>
      <div v-if="settings.locationLat !== null" class="text-xs text-center uppercase tracking-wider" :style="{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }">
        {{ settings.locationLat?.toFixed(4) }}, {{ settings.locationLon?.toFixed(4) }}
        <span v-if="weatherLoading"> · {{ $t('common.loading') }}</span>
      </div>
      <input
        v-model="locationName"
        type="text"
        class="field-input"
        :placeholder="$t('settings.location_name')"
        @blur="saveLocationName"
      />
    </section>

    <!-- Rain threshold -->
    <section class="rounded-2xl p-4 space-y-3 neon-card">
      <h2 class="font-semibold text-sm uppercase tracking-widest" :style="{ color: 'var(--c-muted)' }">
        {{ $t('settings.rain_threshold') }}
      </h2>
      <p class="text-xs uppercase tracking-wider" :style="{ color: 'var(--c-faint)' }">{{ $t('settings.rain_threshold_hint') }}</p>
      <div class="flex items-center gap-3">
        <input
          v-model.number="rainThreshold"
          type="range" min="1" max="30" step="1"
          class="flex-1"
          :style="{ accentColor: 'var(--c-accent-text)' }"
          @change="saveRainThreshold"
        />
        <span class="w-14 text-sm font-semibold text-right uppercase" :style="{ color: 'var(--c-accent-text)', fontFamily: 'var(--font-data)' }">
          {{ rainThreshold }} mm
        </span>
      </div>
    </section>

    <!-- Notifications -->
    <section class="rounded-2xl p-4 space-y-3 neon-card">
      <h2 class="font-semibold text-sm uppercase tracking-widest" :style="{ color: 'var(--c-muted)' }">
        {{ $t('settings.notifications') }}
      </h2>
      <button
        class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all uppercase tracking-widest"
        :style="settings.notificationsEnabled
          ? `background:var(--c-accent-bg);border:1px solid var(--c-accent-border);color:var(--c-accent-text);box-shadow:var(--c-accent-shadow)`
          : `background:var(--c-card);border:1px solid var(--c-ghost-border);color:var(--c-ghost-text)`"
        @click="toggleNotifications"
      >
        <Icon :name="settings.notificationsEnabled
          ? 'streamline:interface-alert-alarm-bell-1-notification-vibrate-ring-sound-alarm-alert-bell-noise'
          : 'streamline:disable-bell-notification'"
        />
        {{ $t('settings.enable_notifications') }}
      </button>
    </section>

    <!-- Theme -->
    <section class="rounded-2xl p-4 space-y-3 neon-card">
      <h2 class="font-semibold text-sm uppercase tracking-widest" :style="{ color: 'var(--c-muted)' }">
        {{ $t('settings.theme') }}
      </h2>
      <div class="flex gap-2">
        <button
          v-for="opt in themeOptions"
          :key="opt.value"
          class="flex-1 py-2 rounded-xl text-sm font-medium transition-all uppercase tracking-wider"
          :style="settings.theme === opt.value
            ? `background:var(--c-accent-bg);border:1px solid var(--c-accent-border);color:var(--c-accent-text);box-shadow:var(--c-accent-shadow)`
            : `background:var(--c-card);border:1px solid var(--c-ghost-border);color:var(--c-ghost-text)`"
          @click="setTheme(opt.value as 'light' | 'dark' | 'system')"
        >
          {{ $t(opt.label) }}
        </button>
      </div>
    </section>

    <!-- Visual mode -->
    <section class="rounded-2xl p-4 space-y-3 neon-card">
      <h2 class="font-semibold text-sm uppercase tracking-widest" :style="{ color: 'var(--c-muted)' }">
        {{ $t('settings.visual_mode') }}
      </h2>
      <div class="flex gap-2">
        <button
          v-for="opt in modeOptions"
          :key="opt.value"
          class="flex-1 py-2 rounded-xl text-sm font-medium transition-all uppercase tracking-wider"
          :style="themeMode === opt.value
            ? `background:var(--c-accent-bg);border:1px solid var(--c-accent-border);color:var(--c-accent-text);box-shadow:var(--c-accent-shadow)`
            : `background:var(--c-card);border:1px solid var(--c-ghost-border);color:var(--c-ghost-text)`"
          @click="setMode(opt.value as 'cyber' | 'kawaii')"
        >
          {{ opt.label }}
        </button>
      </div>
    </section>

    <!-- Language -->
    <section class="rounded-2xl p-4 space-y-3 neon-card">
      <h2 class="font-semibold text-sm uppercase tracking-widest" :style="{ color: 'var(--c-muted)' }">
        {{ $t('settings.language') }}
      </h2>
      <div class="flex gap-2">
        <button
          v-for="lang in ['fr', 'en']"
          :key="lang"
          class="flex-1 py-2 rounded-xl text-sm font-medium transition-all uppercase tracking-wider"
          :style="locale === lang
            ? `background:var(--c-accent-bg);border:1px solid var(--c-accent-border);color:var(--c-accent-text);box-shadow:var(--c-accent-shadow)`
            : `background:var(--c-card);border:1px solid var(--c-ghost-border);color:var(--c-ghost-text)`"
          @click="setLocale(lang)"
        >
          {{ lang === 'fr' ? 'Français' : 'English' }}
        </button>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
const { mode: themeMode, toggle: toggleMode } = useThemeMode()
const settings = useSettingsStore()
const { requestPermission, scheduleAll } = useNotifications()
const { fetchWeather } = useWeather()
const { show: showToast } = useToast()
const { t, locale, setLocale } = useI18n()

const detectingLocation = ref(false)
const weatherLoading    = ref(false)
const locationName      = ref(settings.locationName ?? '')
const rainThreshold     = ref(settings.rainSkipThresholdMm)

const modeOptions = [
  { value: 'cyber',  label: '⚡ Cyber' },
  { value: 'kawaii', label: '🌸 Kawaii' },
]

function setMode(m: 'cyber' | 'kawaii') {
  if (m !== themeMode.value) toggleMode()
}

const themeOptions = [
  { value: 'light',  label: 'settings.theme_light' },
  { value: 'dark',   label: 'settings.theme_dark' },
  { value: 'system', label: 'settings.theme_system' },
]

async function detectLocation() {
  detectingLocation.value = true
  try {
    const pos = await settings.detectLocation()
    if (pos) {
      showToast(t('settings.location_detected'))
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
    if (city) { locationName.value = city; await settings.update({ locationName: city }) }
  } catch {}
}

async function saveLocationName() { await settings.update({ locationName: locationName.value || null }) }
async function saveRainThreshold() { await settings.update({ rainSkipThresholdMm: rainThreshold.value }) }

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
