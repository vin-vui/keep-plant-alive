<template>
  <div>
    <!-- Empty state -->
    <div v-if="plants.length === 0" class="flex flex-col items-center justify-center min-h-64 gap-4 text-center px-6">
      <span class="text-6xl">🌵</span>
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">{{ $t('plants.empty_title') }}</h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('plants.empty_desc') }}</p>
      <NuxtLink
        to="/plants/new"
        class="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
      >
        {{ $t('plants.add_first') }}
      </NuxtLink>
    </div>

    <!-- Grid -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4"
    >
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
