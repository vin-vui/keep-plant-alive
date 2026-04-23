<template>
  <svg
    class="animate-spin"
    :class="[sizeClass, colorClass]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  color?: string
}>(), { size: 'md', color: 'text-brand-600' })

const sizeClass = computed(() => ({ sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[props.size]))
const colorClass = computed(() => props.color)
</script>
