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
useThemeMode() // initialise theme class on <html> on first load

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

onMounted(async () => {
  if (settings.locationLat === null) {
    const pos = await settings.detectLocation()
    if (pos) {
      const { fetchWeather } = useWeather()
      fetchWeather(pos.lat, pos.lon)
    }
  }
})

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
    { rel: 'icon', type: 'image/png', href: '/icons/favicon.png' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'apple-touch-icon', sizes: '192x192', href: '/apple-touch-icon.png' }
  ]
})
</script>
