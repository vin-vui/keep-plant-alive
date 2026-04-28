<template>
  <div class="max-w-lg mx-auto px-4 py-6 fade-in">
    <!-- Step 1: Camera -->
    <div v-if="step === 'capture'" class="space-y-4">
      <CameraCapture ref="cameraRef" @change="onPhotoReady" />

      <button
        v-if="photoFull"
        class="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 uppercase tracking-widest neon-border neon-glow"
        :style="{ background: 'var(--c-accent-bg)', color: 'var(--c-accent-text)' }"
        :disabled="identifying"
        @click="identify"
      >
        <AppSpinner v-if="identifying" size="sm" color="text-brand-500" />
        <Icon v-else name="streamline:interface-search-glass-search-magnifying" />
        {{ identifying ? $t('identify.identifying') : $t('identify.title') }}
      </button>

      <p v-if="identifyError" class="text-sm text-center uppercase tracking-wider" :style="{ color: 'var(--c-error)' }">
        {{ identifyError }}
      </p>

      <button
        v-if="photoFull"
        class="w-full text-sm py-2 uppercase tracking-wider"
        :style="{ color: 'var(--c-muted)' }"
        @click="goManual"
      >
        {{ $t('identify.manual') }}
      </button>
    </div>

    <!-- Step 2: Results -->
    <div v-else-if="step === 'results'">
      <PlantIdentifier :results="idResults" :loading="identifying" @select="onResultSelected" @manual="goManual" />
    </div>

    <!-- Step 3: Confirm -->
    <div v-else-if="step === 'confirm'" class="space-y-4">
      <!-- Thumbnail preview -->
      <div class="w-24 h-24 rounded-2xl overflow-hidden mx-auto neon-border" :style="{ background: 'var(--c-deep)' }">
        <img v-if="photoThumbnail" :src="photoThumbnail" alt="preview" class="w-full h-full object-cover opacity-90" />
        <div v-else class="w-full h-full flex items-center justify-center">
          <Icon name="streamline:sprout" class="text-3xl" :style="{ color: 'var(--c-border)' }" />
        </div>
      </div>

      <div class="space-y-3">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium mb-1 uppercase tracking-wider" :style="{ color: 'var(--c-muted)' }">
            {{ $t('identify.confirm_name') }}
          </label>
          <input
            v-model="form.name"
            type="text"
            class="field-input"
            :placeholder="$t('plants.name')"
          />
        </div>

        <div v-if="form.scientificName" class="text-sm italic px-1" :style="{ color: 'var(--c-muted)', fontFamily: 'var(--font-data)' }">
          {{ form.scientificName }}
        </div>

        <!-- Interval -->
        <div>
          <label class="block text-sm font-medium mb-1 uppercase tracking-wider" :style="{ color: 'var(--c-muted)' }">
            {{ $t('identify.interval_hint') }}
          </label>
          <select v-model.number="form.intervalDays" class="field-input">
            <option
              v-for="n in INTERVAL_OPTIONS"
              :key="n" :value="n"
              :style="{ background: 'var(--c-deep)' }"
            >
              {{ n }} {{ $t('common.days') }}
            </option>
          </select>
        </div>

        <!-- Location toggle -->
        <div>
          <label class="block text-sm font-medium mb-2 uppercase tracking-wider" :style="{ color: 'var(--c-muted)' }">
            {{ $t('plants.location') }}
          </label>
          <div class="flex gap-2">
            <button
              type="button"
              class="flex-1 py-2 rounded-xl text-sm font-medium transition-all uppercase tracking-wider flex items-center justify-center gap-1"
              :style="form.isOutdoor
                ? `background:var(--c-accent-bg);border:1px solid var(--c-accent-border);color:var(--c-accent-text);box-shadow:var(--c-accent-shadow)`
                : `background:var(--c-card);border:1px solid var(--c-ghost-border);color:var(--c-ghost-text)`"
              @click="form.isOutdoor = true"
            >
              <Icon name="streamline:interface-lighting-brightness-1-bright-adjust-brightness-adjustment-sun-raise-controls" />
              {{ $t('plants.outdoor') }}
            </button>
            <button
              type="button"
              class="flex-1 py-2 rounded-xl text-sm font-medium transition-all uppercase tracking-wider flex items-center justify-center gap-1"
              :style="!form.isOutdoor
                ? `background:var(--c-accent-bg);border:1px solid var(--c-accent-border);color:var(--c-accent-text);box-shadow:var(--c-accent-shadow)`
                : `background:var(--c-card);border:1px solid var(--c-ghost-border);color:var(--c-ghost-text)`"
              @click="form.isOutdoor = false"
            >
              <Icon name="streamline:home-3" />
              {{ $t('plants.indoor') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Back / Save -->
      <div class="flex gap-3 pt-2">
        <button
          class="flex-1 py-2.5 rounded-xl font-medium transition-all uppercase tracking-wider"
          :style="{ background: 'var(--c-card)', border: '1px solid var(--c-ghost-border)', color: 'var(--c-ghost-text)' }"
          @click="step = photoFull ? 'results' : 'capture'"
        >
          {{ $t('common.back') }}
        </button>
        <button
          class="flex-1 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 uppercase tracking-wider neon-border"
          :style="{ background: 'var(--c-accent-bg)', color: 'var(--c-accent-text)', opacity: (!form.name.trim() || saving) ? '0.5' : '1' }"
          :disabled="!form.name.trim() || saving"
          @click="savePlant"
        >
          <AppSpinner v-if="saving" size="sm" color="text-brand-500" />
          {{ saving ? $t('common.loading') : $t('identify.add_plant') }}
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

const step          = ref<'capture' | 'results' | 'confirm'>('capture')
const cameraRef     = ref()
const photoFull     = ref<string | null>(null)
const photoThumbnail = ref<string | null>(null)
const saving        = ref(false)

const form = reactive({
  name: '',
  scientificName: null as string | null,
  commonName:     null as string | null,
  family:         null as string | null,
  intervalDays:   7,
  isOutdoor:      true,
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
  } else if (!identifyError.value) {
    goManual()
  }
}

function onResultSelected(result: PlantIdResult) {
  form.scientificName = result.scientificName
  form.commonName     = result.commonNames[0] ?? null
  form.family         = result.family
  form.name           = result.commonNames[0] ?? result.scientificName
  const defaults      = getDefaultWateringProfile(result.family)
  form.intervalDays   = defaults.intervalDays
  step.value          = 'confirm'
}

function goManual() {
  form.scientificName = null
  form.commonName     = null
  form.family         = null
  step.value          = 'confirm'
}

async function savePlant() {
  if (!form.name.trim()) return
  saving.value = true
  try {
    const now = new Date().toISOString()
    await plantsStore.addPlant({
      name:              form.name.trim(),
      scientificName:    form.scientificName,
      commonName:        form.commonName,
      family:            form.family,
      photoDataUrl:      photoFull.value,
      thumbnailDataUrl:  photoThumbnail.value,
      isOutdoor:         form.isOutdoor,
      wateringProfile:   { intervalDays: form.intervalDays, preferredTimeHour: 8 },
      lastWateredAt:     now,
      nextWateringAt:    computeNextWatering(now, form.intervalDays),
      skippedDueToRain:  false,
    })
    showToast(t('plants.added'))
    router.push('/')
  } catch (e: any) {
    showToast(e?.message ?? t('common.error'), 'error')
  } finally {
    saving.value = false
  }
}
</script>
