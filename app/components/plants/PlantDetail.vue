<template>
  <div class="max-w-lg mx-auto px-4 py-6 fade-in">
    <!-- Photo -->
    <div class="aspect-video rounded-2xl overflow-hidden mb-6 neon-border" :style="{ background: 'var(--c-deep)' }">
      <img v-if="photo" :src="photo" :alt="plant.name" class="w-full h-full object-cover opacity-90" />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon name="streamline:sprout" class="text-8xl" :style="{ color: 'var(--c-border)' }" />
      </div>
    </div>

    <!-- Name & taxonomy -->
    <div class="mb-4">
      <h1 class="text-2xl font-bold uppercase tracking-widest neon-text neon-text-glow">{{ plant.name }}</h1>
      <p v-if="plant.scientificName" class="italic mt-1" :style="{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }">
        {{ plant.scientificName }}
      </p>
      <p v-if="plant.family" class="text-xs mt-1" :style="{ color: 'var(--c-faint)', fontFamily: 'var(--font-data)' }">
        {{ plant.family }}
      </p>
    </div>

    <!-- Urgency badge -->
    <div class="mb-4 flex items-center gap-3">
      <span class="px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wider" :style="urgencyBadge">
        {{ $t(`plants.urgency.${urgency}`) }}
      </span>
      <span v-if="plant.skippedDueToRain" class="text-xs" :style="{ color: 'var(--c-accent2-text)' }">
        {{ $t('plants.skip_rain') }}
      </span>
    </div>

    <!-- Watering info grid -->
    <div class="rounded-xl p-4 mb-4 grid grid-cols-2 gap-4 text-sm neon-border" :style="{ background: 'var(--c-card)' }">
      <div>
        <p class="text-xs mb-1 uppercase tracking-wider" :style="{ color: 'var(--c-muted)' }">{{ $t('plants.last_watered') }}</p>
        <p class="font-medium" :style="{ color: 'var(--c-text)' }">
          {{ plant.lastWateredAt ? formatRelative(plant.lastWateredAt, locale) : '—' }}
        </p>
      </div>
      <div>
        <p class="text-xs mb-1 uppercase tracking-wider" :style="{ color: 'var(--c-muted)' }">{{ $t('plants.next_watering') }}</p>
        <p class="font-medium" :style="{ color: 'var(--c-text)' }">
          {{ plant.nextWateringAt ? formatShortDate(plant.nextWateringAt, locale) : '—' }}
        </p>
      </div>
      <div>
        <p class="text-xs mb-1 uppercase tracking-wider" :style="{ color: 'var(--c-muted)' }">{{ $t('plants.interval_label') }}</p>
        <p class="font-medium" :style="{ color: 'var(--c-text)' }">
          {{ plant.wateringProfile.intervalDays }} {{ $t('common.days') }}
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex flex-col gap-3">
      <button
        class="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 uppercase tracking-widest neon-border neon-glow"
        :style="{ background: 'var(--c-accent-bg)', color: 'var(--c-accent-text)' }"
        :disabled="watering"
        @click="$emit('water')"
      >
        <AppSpinner v-if="watering" size="sm" color="text-brand-500" />
        <Icon v-else name="streamline:interface-weather-rain-drop-drops-rain-rainy-meteorology-water-precipitation-weather" />
        {{ $t('plants.water_now') }}
      </button>

      <button
        class="w-full py-2.5 rounded-xl font-medium transition-all uppercase tracking-wider"
        :style="{ background: 'var(--c-error-bg)', border: '1px solid var(--c-error-border)', color: 'var(--c-error)' }"
        @click="$emit('delete')"
      >
        {{ $t('plants.delete') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getWateringUrgency, urgencyBadgeStyle } from '~/utils/wateringLogic'
import { formatRelative, formatShortDate } from '~/utils/dateUtils'
import type { Plant } from '~/types'

const props = defineProps<{ plant: Plant; photo?: string | null; watering?: boolean }>()
defineEmits(['water', 'delete'])

const { locale } = useI18n()

const urgency      = computed(() => getWateringUrgency(props.plant))
const urgencyBadge = computed(() => urgencyBadgeStyle(urgency.value))
</script>
