<template>
  <div class="fade-in">
    <!-- Results list -->
    <div v-if="results.length > 0" class="space-y-2">
      <p class="text-sm font-medium mb-3 uppercase tracking-widest" :style="{ color: 'var(--c-muted)' }">
        {{ $t('identify.choose_result') }}
      </p>
      <button
        v-for="result in results"
        :key="result.scientificName"
        class="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all neon-card"
        @click="$emit('select', result)"
      >
        <img
          v-if="result.imageUrl"
          :src="result.imageUrl"
          class="w-14 h-14 rounded-lg object-cover shrink-0"
          :style="{ border: '1px solid var(--c-border)' }"
          :alt="result.scientificName"
        />
        <div
          v-else
          class="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
          :style="{ background: 'var(--c-deep)', border: '1px solid var(--c-border-lo)' }"
        >
          <Icon name="streamline:leaf" class="text-2xl" :style="{ color: 'var(--c-border)' }" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-medium text-sm truncate italic" :style="{ color: 'var(--c-text)', fontFamily: 'var(--font-data)' }">
            {{ result.scientificName }}
          </p>
          <p v-if="result.commonNames.length" class="text-xs truncate" :style="{ color: 'var(--c-muted)' }">
            {{ result.commonNames[0] }}
          </p>
          <p v-if="result.family" class="text-xs truncate" :style="{ color: 'var(--c-faint)' }">{{ result.family }}</p>
        </div>
        <span
          class="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium uppercase tracking-wider"
          :style="{ background: 'var(--c-accent-bg)', border: '1px solid var(--c-accent-border)', color: 'var(--c-accent-text)' }"
        >
          {{ $t('identify.score', { n: result.score }) }}
        </span>
      </button>

      <button
        class="w-full mt-2 py-2 text-sm transition-colors uppercase tracking-wider"
        :style="{ color: 'var(--c-muted)' }"
        @click="$emit('manual')"
      >
        {{ $t('identify.manual') }}
      </button>
    </div>

    <!-- No results -->
    <div v-else-if="!loading" class="text-center py-6">
      <p :style="{ color: 'var(--c-muted)' }">{{ $t('identify.not_found') }}</p>
      <button class="mt-3 text-sm font-medium uppercase tracking-wider neon-text" @click="$emit('manual')">
        {{ $t('identify.manual') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlantIdResult } from '~/types'

defineProps<{ results: PlantIdResult[]; loading?: boolean }>()
defineEmits(['select', 'manual'])
</script>
