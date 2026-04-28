<template>
  <div>
    <!-- Empty state -->
    <div v-if="plants.length === 0" class="flex flex-col items-center justify-center min-h-64 gap-4 text-center px-6 fade-in">
      <Icon name="streamline:sprout" class="text-6xl neon-glow" :style="{ color: 'var(--c-accent-text)' }" />
      <h2 class="text-xl font-semibold uppercase tracking-widest neon-text">{{ $t('plants.empty_title') }}</h2>
      <p class="text-sm" :style="{ color: 'var(--c-muted)' }">{{ $t('plants.empty_desc') }}</p>
      <NuxtLink
        to="/plants/new"
        class="px-6 py-2.5 rounded-full font-medium transition-all uppercase tracking-widest neon-border neon-glow"
        :style="{ background: 'var(--c-accent-bg)', color: 'var(--c-accent-text)' }"
      >
        {{ $t('plants.add_first') }}
      </NuxtLink>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
      <PlantCard
        v-for="plant in plants"
        :key="plant.id"
        :plant="plant"
        @click="navigateTo(`/plants/${plant.id}`)"
        @water="$emit('water', plant.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Plant } from '~/types'

defineProps<{ plants: Plant[] }>()
defineEmits(['water'])
</script>
