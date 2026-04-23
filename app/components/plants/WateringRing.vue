<template>
  <svg :width="size" :height="size" viewBox="0 0 44 44" class="rotate-[-90deg]">
    <!-- Background track -->
    <circle cx="22" cy="22" :r="radius" fill="none" stroke-width="3" class="stroke-gray-200 dark:stroke-gray-700" />
    <!-- Progress arc -->
    <circle
      cx="22" cy="22"
      :r="radius"
      fill="none"
      stroke-width="3"
      :stroke="color"
      stroke-linecap="round"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="dashOffset"
      style="transition: stroke-dashoffset 0.5s ease"
    />
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  progress: number   // 0–1
  color?: string
  size?: number
}>(), { color: '#16a34a', size: 44 })

const radius = 19
const circumference = 2 * Math.PI * radius
const dashOffset = computed(() => circumference * (1 - Math.max(0, Math.min(1, props.progress))))
</script>
