<template>
  <div>
    <!-- Results list -->
    <div v-if="results.length > 0" class="space-y-2">
      <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{{ $t('identify.choose_result') }}</p>
      <button
        v-for="result in results"
        :key="result.scientificName"
        class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-colors text-left"
        @click="$emit('select', result)"
      >
        <img
          v-if="result.imageUrl"
          :src="result.imageUrl"
          class="w-14 h-14 rounded-lg object-cover shrink-0"
          :alt="result.scientificName"
        />
        <div v-else class="w-14 h-14 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-2xl shrink-0">
          🌿
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-medium text-sm truncate italic">{{ result.scientificName }}</p>
          <p v-if="result.commonNames.length" class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ result.commonNames[0] }}
          </p>
          <p v-if="result.family" class="text-xs text-gray-400 dark:text-gray-500 truncate">{{ result.family }}</p>
        </div>
        <span class="shrink-0 text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full font-medium">
          {{ $t('identify.score', { n: result.score }) }}
        </span>
      </button>

      <button
        class="w-full mt-2 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        @click="$emit('manual')"
      >
        {{ $t('identify.manual') }}
      </button>
    </div>

    <!-- No results -->
    <div v-else-if="!loading" class="text-center py-6">
      <p class="text-gray-500 dark:text-gray-400">{{ $t('identify.not_found') }}</p>
      <button
        class="mt-3 text-sm text-brand-600 dark:text-brand-400 font-medium"
        @click="$emit('manual')"
      >
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
