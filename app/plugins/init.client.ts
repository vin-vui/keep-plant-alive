export default defineNuxtPlugin(async () => {
  const settings = useSettingsStore()
  const plants = usePlantsStore()

  await Promise.all([settings.load(), plants.loadFromIDB()])

  // First-time users: detect location in background (fire-and-forget)
  // Weather fetch is handled by app.vue which watches locationLat
  if (settings.locationLat === null) {
    settings.detectLocation().then(pos => {
      if (pos) settings.resolveCity(pos.lat, pos.lon)
    })
  }
})
