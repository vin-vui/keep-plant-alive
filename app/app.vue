<template>
  <div class="min-h-screen fade-in">
    <AppShell>
      <NuxtPage />
    </AppShell>
    <AppToast />
  </div>
</template>

<script setup lang="ts">
const settings = useSettingsStore()
const { fetchWeather } = useWeather()
useThemeMode() // initialise theme class on <html> on first load

// Returning users: fetch weather on mount
onMounted(() => {
  if (settings.locationLat !== null) {
    fetchWeather(settings.locationLat, settings.locationLon!)
  }
})

// First-time users: fetch weather once GPS resolves
watch(() => settings.locationLat, (lat) => {
  if (lat !== null && settings.locationLon !== null) {
    fetchWeather(lat, settings.locationLon)
  }
})

const prefersDark = ref(import.meta.client
  ? window.matchMedia('(prefers-color-scheme: dark)').matches
  : false
)

if (import.meta.client) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', e => { prefersDark.value = e.matches })
}

const isDark = computed(() => {
  if (settings.theme === 'dark') return true
  if (settings.theme === 'light') return false
  return prefersDark.value
})

watch(isDark, (dark) => {
  document.documentElement.classList.toggle('dark', dark)
}, { immediate: true })


useHead({
  title: 'Keep Plant Alive',
  meta: [
    { name: 'description', content: 'Gérez l\'arrosage de vos plantes' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: 'PlantCare' },
    { name: 'theme-color', content: '#16a34a' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;900&family=Share+Tech+Mono&family=Nunito:wght@400;500;600;700;800&display=swap' },
    { rel: 'icon', type: 'image/png', href: '/icons/favicon.png' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'apple-touch-icon', sizes: '192x192', href: '/apple-touch-icon.png' }
  ]
})
</script>
