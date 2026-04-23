export default defineNuxtPlugin(async () => {
  const settings = useSettingsStore()
  const plants = usePlantsStore()
  await Promise.all([settings.load(), plants.loadFromIDB()])
})
