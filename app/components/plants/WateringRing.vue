<template>
  <svg :width="size" :height="size" viewBox="0 0 44 44" class="rotate-[-90deg]">
    <circle cx="22" cy="22" :r="radius" fill="none" stroke-width="3" :style="{ stroke: 'var(--c-ring-track)' }" />
    <circle
      cx="22" cy="22"
      :r="radius"
      fill="none"
      stroke-width="3"
      :style="{ stroke: color, transition: 'stroke-dashoffset 0.5s ease' }"
      stroke-linecap="round"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="dashOffset"
    />
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  progress: number
  color?: string
  size?: number
}>(), { color: 'var(--c-accent-text)', size: 44 })

const radius = 19
const circumference = 2 * Math.PI * radius
const dashOffset = computed(() => circumference * (1 - Math.max(0, Math.min(1, props.progress))))
</script>
