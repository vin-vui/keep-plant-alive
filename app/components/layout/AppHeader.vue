<template>
  <header class="fixed top-0 inset-x-0 z-40 h-14 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-3">
    <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-brand-600 dark:text-brand-400 text-lg">
      <span class="text-2xl" aria-hidden>🌱</span>
      <span class="hidden sm:inline">Keep Plant Alive</span>
    </NuxtLink>
    <div class="flex-1" />
    <WeatherBadge />
    <NuxtLink
      v-if="route.path !== '/plants/new'"
      to="/plants/new"
      class="flex items-center gap-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-colors"
    >
      <span>+</span>
      <span class="hidden sm:inline">{{ $t('nav.add') }}</span>
    </NuxtLink>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
