<template>
  <div class="max-w-lg mx-auto px-4 py-6">
    <!-- Photo -->
    <div class="aspect-video rounded-2xl overflow-hidden bg-brand-50 dark:bg-brand-900/20 mb-6">
      <img v-if="photo" :src="photo" :alt="plant.name" class="w-full h-full object-cover" />
      <div v-else class="w-full h-full flex items-center justify-center text-8xl">🌱</div>
    </div>

    <!-- Name & taxonomy -->
    <div class="mb-4">
      <h1 class="text-2xl font-bold">{{ plant.name }}</h1>
      <p v-if="plant.scientificName" class="text-gray-500 dark:text-gray-400 italic">{{ plant.scientificName }}</p>
      <p v-if="plant.family" class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ plant.family }}</p>
    </div>

    <!-- Urgency badge -->
    <div class="mb-4 flex items-center gap-3">
      <span class="px-3 py-1 rounded-full text-sm font-medium" :class="urgencyBadge">
        {{ $t(`plants.urgency.${urgency}`) }}
      </span>
      <span v-if="plant.skippedDueToRain" class="text-xs text-blue-500">{{ $t('plants.skip_rain') }}</span>
    </div>

    <!-- Watering info -->
    <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-4 grid grid-cols-2 gap-4 text-sm">
      <div>
        <p class="text-gray-500 dark:text-gray-400 text-xs mb-1">{{ $t('plants.last_watered') }}</p>
        <p class="font-medium">{{ plant.lastWateredAt ? formatRelative(plant.lastWateredAt, locale) : '—' }}</p>
      </div>
      <div>
        <p class="text-gray-500 dark:text-gray-400 text-xs mb-1">{{ $t('plants.next_watering') }}</p>
        <p class="font-medium">{{ plant.nextWateringAt ? formatShortDate(plant.nextWateringAt, locale) : '—' }}</p>
      </div>
      <div>
        <p class="text-gray-500 dark:text-gray-400 text-xs mb-1">{{ $t('plants.interval_label') }}</p>
        <p class="font-medium">{{ plant.wateringProfile.intervalDays }} {{ $t('common.days') }}</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex flex-col gap-3">
      <button
        class="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        :disabled="watering"
        @click="$emit('water')"
      >
        <AppSpinner v-if="watering" size="sm" color="text-white" />
        <span v-else>💧</span>
        {{ $t('plants.water_now') }}
      </button>

      <button
        class="w-full py-2.5 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
        @click="$emit('delete')"
      >
        {{ $t('plants.delete') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getWateringUrgency, urgencyBadgeClass } from '~/utils/wateringLogic'
import { formatRelative, formatShortDate } from '~/utils/dateUtils'
import type { Plant } from '~/types'

const props = defineProps<{ plant: Plant; photo?: string | null; watering?: boolean }>()
defineEmits(['water', 'delete'])

const { locale } = useI18n()

const urgency = computed(() => getWateringUrgency(props.plant))
const urgencyBadge = computed(() => urgencyBadgeClass(urgency.value))
</script>
