<template>
  <div
    class="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Photo or placeholder -->
    <div class="aspect-square bg-brand-50 dark:bg-brand-900/20 relative overflow-hidden">
      <img
        v-if="plant.thumbnailDataUrl"
        :src="plant.thumbnailDataUrl"
        :alt="plant.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-5xl select-none">
        🌱
      </div>

      <!-- Watering ring overlay -->
      <div class="absolute bottom-2 right-2">
        <WateringRing :progress="ringProgress" :color="ringColor" :size="40" />
      </div>
    </div>

    <!-- Info -->
    <div class="p-3">
      <div class="flex items-start justify-between gap-1">
        <div class="min-w-0">
          <p class="font-semibold text-sm truncate">{{ plant.name }}</p>
          <p v-if="plant.scientificName" class="text-xs text-gray-500 dark:text-gray-400 italic truncate">
            {{ plant.scientificName }}
          </p>
        </div>
        <span
          class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full"
          :class="urgencyBadge"
        >
          {{ urgencyLabel }}
        </span>
      </div>

      <!-- Next watering -->
      <div class="mt-2 flex items-center justify-between">
        <span class="text-xs text-gray-400 dark:text-gray-500">
          {{ nextLabel }}
        </span>
        <button
          class="text-xs bg-brand-600 hover:bg-brand-700 text-white px-3 py-1 rounded-full transition-colors font-medium"
          @click.stop="$emit('water')"
        >
          {{ $t('plants.water_now') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getWateringUrgency, urgencyBadgeClass, urgencyRingColor } from '~/utils/wateringLogic'
import { daysUntil } from '~/utils/dateUtils'
import type { Plant } from '~/types'

const props = defineProps<{ plant: Plant }>()
defineEmits(['click', 'water'])

const { t, locale } = useI18n()

const urgency = computed(() => getWateringUrgency(props.plant))
const urgencyBadge = computed(() => urgencyBadgeClass(urgency.value))
const ringColor = computed(() => urgencyRingColor(urgency.value))

const urgencyLabel = computed(() => t(`plants.urgency.${urgency.value}`))

const nextLabel = computed(() => {
  const days = daysUntil(props.plant.nextWateringAt)
  if (days < 0) return `${Math.abs(days)} ${t('common.days')}`
  if (days === 0) return t('plants.urgency.today')
  return `J+${days}`
})

const ringProgress = computed(() => {
  if (!props.plant.lastWateredAt || !props.plant.nextWateringAt) return 0
  const total = new Date(props.plant.nextWateringAt).getTime() - new Date(props.plant.lastWateredAt).getTime()
  const elapsed = Date.now() - new Date(props.plant.lastWateredAt).getTime()
  return Math.max(0, Math.min(1, 1 - elapsed / total))
})
</script>
