<template>
  <div :class="rootClass">
    <AppShell>
      <NuxtPage />
    </AppShell>
    <AppToast />
  </div>
</template>

<script setup lang="ts">
const settings = useSettingsStore()

const rootClass = computed(() => {
  const base = 'min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100'
  if (settings.theme === 'dark') return `${base} dark`
  if (settings.theme === 'light') return base
  return base
})

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
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/icons/favicon.svg' }]
})
</script>
