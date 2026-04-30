<template>
  <div class="max-w-lg mx-auto px-4 py-6 space-y-6 fade-in">

    <!-- Location -->
    <section class="rounded-2xl p-4 space-y-3 neon-card">
      <h2 class="font-semibold text-sm uppercase tracking-widest" :style="{ color: 'var(--c-muted)' }">
        {{ $t('settings.location') }}
      </h2>
      <button
        class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all uppercase tracking-widest neon-border"
        :style="{ background: 'var(--c-accent-bg)', color: 'var(--c-accent-text)', opacity: (detectingLocation || settings.locationDetecting) ? '0.7' : '1' }"
        :disabled="detectingLocation || settings.locationDetecting"
        @click="detectLocation"
      >
        <AppSpinner v-if="detectingLocation || settings.locationDetecting" size="sm" color="text-brand-500" />
        <Icon v-else name="streamline:location-pin-3" />
        {{ (detectingLocation || settings.locationDetecting) ? $t('common.loading') : $t('settings.detect_location') }}
      </button>

      <!-- City name: shown as soon as we have coords, editable -->
      <div v-if="settings.locationLat !== null || locationName" class="flex items-center gap-2">
        <Icon name="streamline:location-pin-3" class="text-sm shrink-0" :style="{ color: 'var(--c-muted)' }" />
        <input
          v-model="locationName"
          type="text"
          class="field-input"
          :placeholder="settings.locationDetecting ? $t('common.loading') : $t('settings.location_name')"
          @blur="saveLocationName"
        />
      </div>
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

// Sync city name if resolved in background (plugin auto-detection)
watch(() => settings.locationName, (name) => {
  if (name && !locationName.value) locationName.value = name
})

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
      weatherLoading.value = true
      const [city] = await Promise.all([
        settings.resolveCity(pos.lat, pos.lon, locale.value),
        fetchWeather(pos.lat, pos.lon).finally(() => { weatherLoading.value = false })
      ])
      if (city) locationName.value = city
      showToast(city ? `${city} · ${t('settings.location_detected')}` : t('settings.location_detected'))
    }
  } finally {
    detectingLocation.value = false
  }
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
