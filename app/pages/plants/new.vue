<template>
  <div class="max-w-lg mx-auto px-4 py-6">
    <h1 class="text-xl font-bold mb-6">{{ $t('identify.title') }}</h1>

    <!-- Step 1: Camera -->
    <div v-if="step === 'capture'" class="space-y-4">
      <CameraCapture ref="cameraRef" @change="onPhotoReady" />

      <button
        v-if="photoFull"
        class="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        :disabled="identifying"
        @click="identify"
      >
        <AppSpinner v-if="identifying" size="sm" color="text-white" />
        <span v-else>🔍</span>
        {{ identifying ? $t('identify.identifying') : $t('identify.title') }}
      </button>

      <p v-if="identifyError" class="text-sm text-red-500 text-center">{{ identifyError }}</p>

      <button
        v-if="photoFull"
        class="w-full text-sm text-gray-500 dark:text-gray-400 py-2"
        @click="goManual"
      >
        {{ $t('identify.manual') }}
      </button>
    </div>

    <!-- Step 2: Choose result -->
    <div v-else-if="step === 'results'">
      <PlantIdentifier
        :results="idResults"
        :loading="identifying"
        @select="onResultSelected"
        @manual="goManual"
      />
    </div>

    <!-- Step 3: Confirm and add -->
    <div v-else-if="step === 'confirm'" class="space-y-4">
      <!-- Thumbnail preview -->
      <div class="w-24 h-24 rounded-2xl overflow-hidden mx-auto bg-brand-50 dark:bg-brand-900/20">
        <img v-if="photoThumbnail" :src="photoThumbnail" alt="preview" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-3xl">🌱</div>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ $t('identify.confirm_name') }}
          </label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            :placeholder="$t('plants.name')"
          />
        </div>

        <div v-if="form.scientificName" class="text-sm text-gray-500 dark:text-gray-400 italic px-1">
          {{ form.scientificName }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ $t('identify.interval_hint') }}
          </label>
          <select
            v-model.number="form.intervalDays"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option v-for="n in INTERVAL_OPTIONS" :key="n" :value="n">
              {{ n }} {{ $t('common.days') }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <button
          class="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          @click="step = photoFull ? 'results' : 'capture'"
        >
          {{ $t('common.back') }}
        </button>
        <button
          class="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          :disabled="!form.name.trim() || saving"
          @click="savePlant"
        >
          <AppSpinner v-if="saving" size="sm" color="text-white" />
          {{ $t('identify.add_plant') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { INTERVAL_OPTIONS, getDefaultWateringProfile } from '~/utils/wateringDefaults'
import { computeNextWatering } from '~/utils/wateringLogic'
import type { PlantIdResult } from '~/types'

const plantsStore = usePlantsStore()
const { identifyPlant, loading: identifying, error: identifyError, results: idResults } = usePlantId()
const { show: showToast } = useToast()
const { t } = useI18n()
const router = useRouter()

const step = ref<'capture' | 'results' | 'confirm'>('capture')
const cameraRef = ref()
const photoFull = ref<string | null>(null)
const photoThumbnail = ref<string | null>(null)
const saving = ref(false)

const form = reactive({
  name: '',
  scientificName: null as string | null,
  commonName: null as string | null,
  family: null as string | null,
  intervalDays: 7
})

function onPhotoReady({ full, thumbnail }: { full: string; thumbnail: string }) {
  photoFull.value = full
  photoThumbnail.value = thumbnail
}

async function identify() {
  if (!photoFull.value) return
  const results = await identifyPlant(photoFull.value)
  if (results.length > 0) {
    step.value = 'results'
  } else {
    goManual()
  }
}

function onResultSelected(result: PlantIdResult) {
  form.scientificName = result.scientificName
  form.commonName = result.commonNames[0] ?? null
  form.family = result.family
  form.name = result.commonNames[0] ?? result.scientificName
  const defaults = getDefaultWateringProfile(result.family)
  form.intervalDays = defaults.intervalDays
  step.value = 'confirm'
}

function goManual() {
  form.scientificName = null
  form.commonName = null
  form.family = null
  step.value = 'confirm'
}

async function savePlant() {
  if (!form.name.trim()) return
  saving.value = true
  try {
    const now = new Date().toISOString()
    await plantsStore.addPlant({
      name: form.name.trim(),
      scientificName: form.scientificName,
      commonName: form.commonName,
      family: form.family,
      photoDataUrl: photoFull.value,
      thumbnailDataUrl: photoThumbnail.value,
      wateringProfile: { intervalDays: form.intervalDays, preferredTimeHour: 8 },
      lastWateredAt: now,
      nextWateringAt: computeNextWatering(now, form.intervalDays),
      skippedDueToRain: false
    })
    showToast(`${form.name} ${t('plants.watered')}`)
    router.push('/')
  } finally {
    saving.value = false
  }
}
</script>
