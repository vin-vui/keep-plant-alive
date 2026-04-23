export function useNotifications() {
  const settingsStore = useSettingsStore()
  const plantsStore = usePlantsStore()

  async function requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false
    const result = await Notification.requestPermission()
    const granted = result === 'granted'
    await settingsStore.update({ notificationsEnabled: granted })
    return granted
  }

  async function scheduleForPlant(plant: { id: string; name: string; nextWateringAt: string | null }) {
    if (!plant.nextWateringAt || Notification.permission !== 'granted') return
    const reg = await navigator.serviceWorker?.ready
    if (!reg) return
    const next = new Date(plant.nextWateringAt)
    if (next <= new Date()) return

    const options: NotificationOptions & { showTrigger?: any } = {
      tag: `water-${plant.id}`,
      body: plant.name,
      icon: '/icons/pwa-192x192.png',
      data: { plantId: plant.id },
      actions: [{ action: 'watered', title: '✓ Arrosé' }] as any
    }
    if ('TimestampTrigger' in window) {
      options.showTrigger = new (window as any).TimestampTrigger(next.getTime())
    }
    await reg.showNotification(`Arroser ${plant.name}`, options)
  }

  async function scheduleAll() {
    for (const plant of plantsStore.plants) {
      await scheduleForPlant(plant)
    }
  }

  return { requestPermission, scheduleForPlant, scheduleAll }
}
