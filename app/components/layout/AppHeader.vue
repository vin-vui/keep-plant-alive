<template>
  <header
    class="fixed top-0 inset-x-0 z-40 h-14 flex items-center px-4 gap-3"
    :style="{
      background: 'var(--c-glass)',
      borderBottom: '1px solid var(--c-border)',
      boxShadow: 'var(--shadow-header)',
      backdropFilter: 'blur(12px)',
    }"
  >
    <img src="/icons/logo.png" alt="" class="h-8 w-8 rounded-lg shrink-0" aria-hidden />

    <h1 class="flex-1 font-semibold text-lg truncate neon-text neon-text-glow uppercase tracking-widest">{{ title }}</h1>

    <WeatherBadge v-if="isHome" />
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const plantsStore = usePlantsStore()

const isHome = computed(() => route.path === '/')

const title = computed(() => {
  if (route.path === '/') return t('nav.home')
  if (route.path === '/settings') return t('settings.title')
  if (route.path === '/plants/new') return t('identify.title')
  if (route.path.startsWith('/plants/')) {
    const id = route.params.id as string
    return plantsStore.plants.find(p => p.id === id)?.name ?? '…'
  }
  return ''
})
</script>
