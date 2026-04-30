<template>
  <div
    class="fixed bottom-0 inset-x-0 z-40 flex justify-center pointer-events-none"
    style="padding-bottom: max(1.25rem, env(safe-area-inset-bottom))"
  >
    <nav
      class="pointer-events-auto flex items-center gap-2 p-0.5 rounded-full"
      :style="{
        background: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
      }"
    >
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="dock-item flex items-center justify-center transition-all duration-200 rounded-full px-6 py-4"
        :class="isActive(item.to) ? 'active gap-2' : 'inactive'"
        :style="isActive(item.to)
          ? { background: 'var(--c-accent-bg)', border: '1px solid var(--c-accent-border)', boxShadow: 'var(--c-accent-shadow)' }
          : { border: '1px solid transparent' }"
      >
        <Icon :name="item.icon" class="text-xl shrink-0" aria-hidden />
        <span
          v-if="isActive(item.to)"
          class="text-sm font-semibold uppercase tracking-widest whitespace-nowrap"
        >
          {{ $t(item.label) }}
        </span>
      </NuxtLink>
    </nav>
  </div>
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

<style scoped>
.dock-item:active { transform: scale(0.93); }

.dock-item.active  { color: var(--c-accent-text); }
.dock-item.inactive { color: var(--c-muted); }
.dock-item.inactive:hover { color: var(--c-text); }

.theme-cyber .dock-item.active {
  text-shadow: 0 0 8px var(--c-accent-text);
  filter: drop-shadow(0 0 4px var(--c-accent-text));
}
</style>
