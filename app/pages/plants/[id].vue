<template>
  <div>
    <div v-if="plant">
      <PlantDetail
        :plant="plant"
        :photo="photo"
        :watering="watering"
        @water="handleWater"
        @delete="confirmDelete = true"
      />
    </div>

    <div v-else class="flex items-center justify-center min-h-64">
      <NuxtLink to="/" class="uppercase tracking-wider neon-text">← {{ $t('common.back') }}</NuxtLink>
    </div>

    <AppModal v-model="confirmDelete" :title="$t('plants.delete_confirm')">
      <div class="flex gap-3 mt-4">
        <button
          class="flex-1 py-2.5 rounded-xl font-medium transition-all uppercase tracking-wider"
          :style="{ background: 'var(--c-card)', border: '1px solid var(--c-ghost-border)', color: 'var(--c-ghost-text)' }"
          @click="confirmDelete = false"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          class="flex-1 py-2.5 rounded-xl font-semibold transition-all uppercase tracking-wider"
          :style="{ background: 'var(--c-error-bg)', border: '1px solid var(--c-error-border)', color: 'var(--c-error)' }"
          @click="deletePlant"
        >
          {{ $t('plants.delete') }}
        </button>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
const route  = useRoute()
const router = useRouter()
const plantsStore = usePlantsStore()
const { water }   = useWateringSchedule()
const { show: showToast } = useToast()
const { t } = useI18n()

const id    = computed(() => route.params.id as string)
const plant = computed(() => plantsStore.plants.find(p => p.id === id.value) ?? null)

const photo         = ref<string | null>(null)
const watering      = ref(false)
const confirmDelete = ref(false)

onMounted(async () => {
  if (id.value) photo.value = await plantsStore.getPhoto(id.value)
})

async function handleWater() {
  watering.value = true
  try {
    await water(id.value)
    showToast(t('plants.watered'))
  } finally {
    watering.value = false
  }
}

async function deletePlant() {
  confirmDelete.value = false
  await plantsStore.deletePlant(id.value)
  router.push('/')
}
</script>
