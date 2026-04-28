<template>
  <nav
    class="fixed bottom-0 inset-x-0 z-40 h-24 flex items-center justify-around safe-area-bottom"
    :style="{
      background: 'var(--c-glass)',
      borderTop: '1px solid var(--c-border)',
      boxShadow: '0 -1px 20px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(12px)',
    }"
  >
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center gap-0.5 px-4 py-1 transition-all w-full uppercase tracking-widest text-xs font-medium"
      :class="isActive(item.to) ? 'nav-active' : 'nav-inactive'"
    >
      <Icon :name="item.icon" class="text-xl" aria-hidden />
      <span>{{ $t(item.label) }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { to: '/',           icon: 'streamline:leaf',  label: 'nav.home' },
  { to: '/plants/new', icon: 'streamline:add-1', label: 'nav.add' },
  { to: '/settings',   icon: 'streamline:cog',   label: 'nav.settings' }
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
