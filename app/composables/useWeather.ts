import type { WeatherSnapshot } from '~/types'

const CACHE_TTL_MS = 30 * 60 * 1000

// Module-level loading state shared across all useWeather() calls
const _loading = ref(false)

export function useWeather() {
  const config = useRuntimeConfig()
  const settingsStore = useSettingsStore()
  const error = ref<string | null>(null)

  function isCacheValid(): boolean {
    if (!settingsStore.weatherFetchedAt || !settingsStore.weatherSnapshot) return false
    return Date.now() - new Date(settingsStore.weatherFetchedAt).getTime() < CACHE_TTL_MS
  }

  async function fetchWeather(lat: number, lon: number): Promise<WeatherSnapshot | null> {
    if (isCacheValid()) return settingsStore.weatherSnapshot
    _loading.value = true
    error.value = null
    try {
      const apiKey = config.public.openweatherApiKey
      const base = `lat=${lat}&lon=${lon}&appid=${encodeURIComponent(apiKey)}&units=metric`

      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?${base}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?${base}&cnt=16`)
      ])

      if (!currentRes.ok) throw new Error(`weather:${currentRes.status}`)
      if (!forecastRes.ok) throw new Error(`forecast:${forecastRes.status}`)

      const [current, forecast] = await Promise.all([currentRes.json(), forecastRes.json()])

      // rain.1h = mm fallen in the last hour (absent when 0)
      const rainLast24hMm = Math.round((current.rain?.['1h'] ?? 0) * 10) / 10

      // forecast list = 3h slots; 16 slots = 48h
      const forecastList: any[] = forecast.list ?? []
      const rainForecast48hMm = Math.round(
        forecastList.reduce((s: number, h: any) => s + (h.rain?.['3h'] ?? 0), 0) * 10
      ) / 10

      const snapshot: WeatherSnapshot = {
        fetchedAt: new Date().toISOString(),
        lat, lon,
        rainLast24hMm,
        rainForecast48hMm,
        conditionMain: current.weather?.[0]?.main ?? '',
        tempCelsius: Math.round(current.main?.temp ?? 0)
      }
      await settingsStore.updateWeather(snapshot)
      return snapshot
    } catch (e: any) {
      console.error('[weather] fetch failed:', e.message)
      error.value = e.message
      return null
    } finally {
      _loading.value = false
    }
  }

  async function refresh(): Promise<WeatherSnapshot | null> {
    const { locationLat: lat, locationLon: lon } = settingsStore
    if (lat === null || lon === null) return null
    return fetchWeather(lat, lon)
  }

  return { loading: _loading, error, isCacheValid, fetchWeather, refresh }
}
