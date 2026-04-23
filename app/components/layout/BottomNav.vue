<template>
  <nav class="fixed bottom-0 inset-x-0 z-40 h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200 dark:border-gray-800 flex items-center justify-around safe-area-bottom">
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors"
      :class="isActive(item.to)
        ? 'text-brand-600 dark:text-brand-400'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
    >
      <span class="text-xl" aria-hidden>{{ item.icon }}</span>
      <span class="text-xs font-medium">{{ $t(item.label) }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { to: '/',         icon: '🌿', label: 'nav.home' },
  { to: '/plants/new', icon: '➕', label: 'nav.add' },
  { to: '/settings', icon: '⚙️', label: 'nav.settings' }
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
