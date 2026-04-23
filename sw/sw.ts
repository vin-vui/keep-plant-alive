import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: any[] }

self.skipWaiting()
clientsClaim()

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action === 'watered') {
    const plantId = event.notification.data?.plantId
    if (plantId) {
      event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clients) => {
          const client = clients.find(c => c.url.includes('/'))
          if (client) {
            client.postMessage({ type: 'PLANT_WATERED', plantId })
            client.focus()
          } else {
            self.clients.openWindow(`/plants/${plantId}`)
          }
        })
      )
    }
  } else {
    const plantId = event.notification.data?.plantId
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        const client = clients.find(c => c.url.includes('/'))
        if (client) { client.focus() }
        else { self.clients.openWindow(plantId ? `/plants/${plantId}` : '/') }
      })
    )
  }
})
