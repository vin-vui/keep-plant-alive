<template>
  <div class="neon-card rounded-2xl overflow-hidden cursor-pointer fade-in" @click="$emit('click')">
    <!-- Photo or placeholder -->
    <div class="aspect-square relative overflow-hidden" :style="{ background: 'var(--c-deep)' }">
      <img
        v-if="plant.thumbnailDataUrl"
        :src="plant.thumbnailDataUrl"
        :alt="plant.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center select-none">
        <Icon name="streamline:sprout" class="text-5xl" :style="{ color: 'var(--c-border)' }" />
      </div>

      <!-- Indoor/outdoor badge -->
      <div class="absolute top-2 left-2">
        <span
          class="rounded-full p-1 flex items-center justify-center"
          :style="{ background: 'var(--c-glass)', border: '1px solid var(--c-border)' }"
        >
          <Icon
            :name="plant.isOutdoor
              ? 'streamline:interface-lighting-brightness-1-bright-adjust-brightness-adjustment-sun-raise-controls'
              : 'streamline:home-3'"
            class="text-sm"
            :style="{ color: 'var(--c-accent-text)' }"
          />
        </span>
      </div>

      <!-- Watering ring -->
      <div class="absolute bottom-2 right-2">
        <WateringRing :progress="ringProgress" :color="ringColor" :size="40" />
      </div>
    </div>

    <!-- Info -->
    <div class="p-3">
      <div class="flex items-start justify-between gap-1">
        <div class="min-w-0">
          <p class="font-semibold text-sm truncate uppercase tracking-wide" :style="{ color: 'var(--c-text)' }">
            {{ plant.name }}
          </p>
          <p
            v-if="plant.scientificName"
            class="text-xs italic truncate"
            :style="{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }"
          >
            {{ plant.scientificName }}
          </p>
        </div>
        <span
          class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full uppercase tracking-wider"
          :style="urgencyBadge"
        >
          {{ urgencyLabel }}
        </span>
      </div>

      <!-- Next watering -->
      <div class="mt-2 flex items-center justify-between">
        <span class="text-xs" :style="{ color: 'var(--c-muted)' }">{{ nextLabel }}</span>
        <button
          class="water-btn text-xs px-3 py-1 rounded-full font-medium transition-all uppercase tracking-wider"
          @click.stop="$emit('water')"
        >
          {{ $t('plants.water_now') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getWateringUrgency, urgencyBadgeStyle, urgencyRingColor } from '~/utils/wateringLogic'
import { daysUntil } from '~/utils/dateUtils'
import type { Plant } from '~/types'

const props = defineProps<{ plant: Plant }>()
defineEmits(['click', 'water'])

const { t } = useI18n()

const urgency   = computed(() => getWateringUrgency(props.plant))
const urgencyBadge = computed(() => urgencyBadgeStyle(urgency.value))
const ringColor = computed(() => urgencyRingColor(urgency.value))
const urgencyLabel = computed(() => t(`plants.urgency.${urgency.value}`))

const nextLabel = computed(() => {
  const days = daysUntil(props.plant.nextWateringAt)
  if (days < 0)  return `${Math.abs(days)} ${t('common.days')}`
  if (days === 0) return t('plants.urgency.today')
  return `J+${days}`
})

const ringProgress = computed(() => {
  if (!props.plant.lastWateredAt || !props.plant.nextWateringAt) return 0
  const total   = new Date(props.plant.nextWateringAt).getTime() - new Date(props.plant.lastWateredAt).getTime()
  const elapsed = Date.now() - new Date(props.plant.lastWateredAt).getTime()
  return Math.max(0, Math.min(1, 1 - elapsed / total))
})
</script>

<style scoped>
.water-btn {
  background: var(--c-accent-bg);
  border: 1px solid var(--c-border);
  color: var(--c-accent-text);
}
.water-btn:hover {
  box-shadow: var(--c-accent-shadow);
  border-color: var(--c-accent-border);
}
</style>
