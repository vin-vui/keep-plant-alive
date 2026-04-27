<template>
  <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <AppShell>
      <NuxtPage />
    </AppShell>
    <AppToast />
  </div>
</template>

<script setup lang="ts">
const settings = useSettingsStore()

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
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'theme-color', content: '#16a34a' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/icons/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/icons/pwa-192x192.png' }
  ]
})
</script>
