<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Preview -->
    <div
      v-if="preview"
      class="w-full aspect-square rounded-2xl overflow-hidden neon-border"
      :style="{ background: 'var(--c-deep)' }"
    >
      <img :src="preview" alt="preview" class="w-full h-full object-cover opacity-90" />
    </div>

    <!-- Upload area -->
    <label v-else class="upload-area w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all">
      <Icon name="streamline:camera-1" class="text-5xl" :style="{ color: 'var(--c-border)' }" />
      <span class="text-sm uppercase tracking-widest" :style="{ color: 'var(--c-muted)' }">{{ $t('identify.take_photo') }}</span>
      <input type="file" accept="image/*" capture="environment" class="sr-only" @change="onFileChange" />
    </label>

    <!-- Change photo -->
    <label v-if="preview" class="text-sm font-medium cursor-pointer uppercase tracking-wider neon-text">
      {{ $t('identify.choose_file') }}
      <input type="file" accept="image/*" class="sr-only" @change="onFileChange" />
    </label>

    <!-- Processing -->
    <div v-if="processing" class="flex items-center gap-2 text-sm" :style="{ color: 'var(--c-muted)' }">
      <AppSpinner size="sm" color="text-brand-500" />
      <span class="uppercase tracking-wider">{{ $t('common.loading') }}</span>
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

function reset() { preview.value = null }
defineExpose({ reset })
</script>

<style scoped>
.upload-area {
  background: var(--c-deep);
  border: 2px dashed var(--c-border);
}
.upload-area:hover {
  border-color: var(--c-accent-border);
  box-shadow: var(--c-accent-shadow);
}
</style>
