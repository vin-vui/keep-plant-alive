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
        <div class="shrink-0 relative">
          <img
            v-if="result.imageUrl"
            :src="result.imageUrl"
            class="w-20 h-20 rounded-xl object-cover"
            :style="{ border: '1px solid var(--c-border)' }"
            :alt="result.scientificName"
            @click.stop="lightboxUrl = result.imageUrl"
          />
          <div
            v-else
            class="w-20 h-20 rounded-xl flex items-center justify-center"
            :style="{ background: 'var(--c-deep)', border: '1px solid var(--c-border-lo)' }"
          >
            <Icon name="streamline:leaf" class="text-3xl" :style="{ color: 'var(--c-border)' }" />
          </div>
          <!-- zoom hint -->
          <div
            v-if="result.imageUrl"
            class="absolute bottom-1 right-1 rounded-full p-0.5"
            :style="{ background: 'var(--c-glass)' }"
            @click.stop="lightboxUrl = result.imageUrl"
          >
            <Icon name="streamline:interface-zoom-in-expand-magnify-glass-search-zoom" class="text-xs" :style="{ color: 'var(--c-muted)' }" />
          </div>
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

    <!-- Lightbox overlay -->
    <Teleport to="body">
      <div
        v-if="lightboxUrl"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.85); backdrop-filter: blur(4px)"
        @click="lightboxUrl = null"
      >
        <img
          :src="lightboxUrl"
          class="max-w-full max-h-full rounded-2xl object-contain"
          style="max-height: 80vh; box-shadow: 0 0 40px rgba(0,0,0,0.5)"
          @click.stop
        />
        <button
          class="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
          :style="{ background: 'var(--c-glass)', border: '1px solid var(--c-border)', color: 'var(--c-text)' }"
          @click="lightboxUrl = null"
        >
          <Icon name="streamline:interface-delete-1-remove-add-button-plus-cross-delete-x-mathematics" />
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { PlantIdResult } from '~/types'

defineProps<{ results: PlantIdResult[]; loading?: boolean }>()
defineEmits(['select', 'manual'])

const lightboxUrl = ref<string | null>(null)
</script>
