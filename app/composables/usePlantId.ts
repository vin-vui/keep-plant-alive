import type { PlantIdResult } from '~/types'

export function usePlantId() {
  const config = useRuntimeConfig()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const results = ref<PlantIdResult[]>([])

  async function identifyPlant(imageDataUrl: string): Promise<PlantIdResult[]> {
    loading.value = true
    error.value = null
    results.value = []

    try {
      const { dataUrlToBlob } = await import('~/utils/imageUtils')
      const blob = dataUrlToBlob(imageDataUrl)
      const form = new FormData()
      form.append('images', blob, 'plant.jpg')
      form.append('organs', 'auto')

      const apiKey = config.public.plantnetApiKey
      if (!apiKey || apiKey === 'your_plantnet_key_here') {
        throw new Error('Clé API PlantNet manquante — configure NUXT_PUBLIC_PLANTNET_API_KEY dans .env')
      }
      const url = `https://my-api.plantnet.org/v2/identify/all?api-key=${encodeURIComponent(apiKey)}&include-related-images=true`
      const res = await fetch(url, { method: 'POST', body: form })

      if (!res.ok) {
        if (res.status === 401) throw new Error('Clé API PlantNet invalide (401) — vérifie NUXT_PUBLIC_PLANTNET_API_KEY dans .env')
        const body = await res.text().catch(() => '')
        throw new Error(`PlantNet ${res.status}: ${body}`)
      }

      const data = await res.json()
      results.value = (data.results ?? []).slice(0, 5).map((r: any): PlantIdResult => ({
        scientificName: r.species?.scientificNameWithoutAuthor ?? '',
        commonNames: r.species?.commonNames ?? [],
        family: r.species?.family?.scientificNameWithoutAuthor ?? null,
        score: Math.round((r.score ?? 0) * 100),
        imageUrl: r.images?.[0]?.url?.m ?? null
      }))
      return results.value
    } catch (e: any) {
      error.value = e.message ?? 'Identification failed'
      return []
    } finally {
      loading.value = false
    }
  }

  return { loading, error, results, identifyPlant }
}
