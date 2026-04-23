import type { WeatherSnapshot } from '~/types'

const CACHE_TTL_MS = 60 * 60 * 1000

export function useWeather() {
  const config = useRuntimeConfig()
  const settingsStore = useSettingsStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  function isCacheValid(): boolean {
    if (!settingsStore.weatherFetchedAt || !settingsStore.weatherSnapshot) return false
    return Date.now() - new Date(settingsStore.weatherFetchedAt).getTime() < CACHE_TTL_MS
  }

  async function fetchWeather(lat: number, lon: number): Promise<WeatherSnapshot | null> {
    if (isCacheValid()) return settingsStore.weatherSnapshot
    loading.value = true
    error.value = null
    try {
      const apiKey = config.public.openweatherApiKey
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${encodeURIComponent(apiKey)}&units=metric&exclude=minutely,alerts`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`OpenWeather ${res.status}`)
      const data = await res.json()

      const hourly: any[] = data.hourly ?? []
      const rainLast24hMm  = hourly.slice(0, 24).reduce((s: number, h: any) => s + (h.rain?.['1h'] ?? 0), 0)
      const rainForecast48hMm = hourly.slice(0, 48).reduce((s: number, h: any) => s + (h.rain?.['1h'] ?? 0), 0)

      const snapshot: WeatherSnapshot = {
        fetchedAt: new Date().toISOString(),
        lat, lon,
        rainLast24hMm: Math.round(rainLast24hMm * 10) / 10,
        rainForecast48hMm: Math.round(rainForecast48hMm * 10) / 10,
        conditionMain: data.current?.weather?.[0]?.main ?? '',
        tempCelsius: Math.round(data.current?.temp ?? 0)
      }
      await settingsStore.updateWeather(snapshot)
      return snapshot
    } catch (e: any) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function refresh(): Promise<WeatherSnapshot | null> {
    const { locationLat: lat, locationLon: lon } = settingsStore
    if (lat === null || lon === null) return null
    return fetchWeather(lat, lon)
  }

  return { loading, error, isCacheValid, fetchWeather, refresh }
}
