<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Preview -->
    <div
      v-if="preview"
      class="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
    >
      <img :src="preview" alt="preview" class="w-full h-full object-cover" />
    </div>

    <!-- Upload area (no preview) -->
    <label
      v-else
      class="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-brand-400 dark:hover:border-brand-500 transition-colors bg-gray-50 dark:bg-gray-800/50"
    >
      <span class="text-5xl">📷</span>
      <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('identify.take_photo') }}</span>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        class="sr-only"
        @change="onFileChange"
      />
    </label>

    <!-- Change photo button -->
    <label
      v-if="preview"
      class="text-sm text-brand-600 dark:text-brand-400 font-medium cursor-pointer"
    >
      {{ $t('identify.choose_file') }}
      <input type="file" accept="image/*" class="sr-only" @change="onFileChange" />
    </label>

    <!-- Processing indicator -->
    <div v-if="processing" class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <AppSpinner size="sm" />
      <span>{{ $t('common.loading') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { processPlantImage } from '~/utils/imageUtils'

const emit = defineEmits<{
  change: [{ full: string; thumbnail: string; file: File }]
}>()

const preview = ref<string | null>(null)
const processing = ref(false)

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  processing.value = true
  try {
    const { full, thumbnail } = await processPlantImage(file)
    preview.value = full
    emit('change', { full, thumbnail, file })
  } finally {
    processing.value = false
  }
}

function reset() {
  preview.value = null
}

defineExpose({ reset })
</script>
