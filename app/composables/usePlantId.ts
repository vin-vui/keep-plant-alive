import type { PlantIdResult } from '~/types'

export function usePlantId() {
  const config = useRuntimeConfig()
  const { t } = useI18n()
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
        throw new Error('NO_API_KEY')
      }
      const url = `https://my-api.plantnet.org/v2/identify/all?api-key=${encodeURIComponent(apiKey)}&include-related-images=true`

      let res: Response
      try {
        res = await fetch(url, { method: 'POST', body: form })
      } catch {
        throw new Error('NETWORK_ERROR')
      }

      if (!res.ok) {
        if (res.status === 401) throw new Error('INVALID_KEY')
        if (res.status === 404) {
          results.value = []
          return []
        }
        console.error(`PlantNet error ${res.status}:`, await res.text().catch(() => ''))
        throw new Error('SERVER_ERROR')
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
      const code = e.message
      if (code === 'NO_API_KEY')    error.value = t('identify.error_no_api_key')
      else if (code === 'INVALID_KEY')   error.value = t('identify.error_invalid_key')
      else if (code === 'NETWORK_ERROR') error.value = t('identify.error_network')
      else if (code === 'SERVER_ERROR')  error.value = t('identify.error_server')
      else                               error.value = t('identify.error_generic')
      return []
    } finally {
      loading.value = false
    }
  }

  return { loading, error, results, identifyPlant }
}
