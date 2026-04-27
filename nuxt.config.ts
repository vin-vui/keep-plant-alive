import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-11-01',
  ssr: false,

  css: ['~/assets/css/main.css'],

  components: {
    dirs: [{ path: '~/components', pathPrefix: false }]
  },

  vite: {
    plugins: [tailwindcss()]
  },

  modules: [
    '@vite-pwa/nuxt',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],

  i18n: {
    locales: [
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale: 'fr',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'fr'
    }
  },

  pwa: {
    strategies: 'injectManifest',
    srcDir: 'sw',
    filename: 'sw.ts',
    registerType: 'prompt',
    manifest: {
      name: 'Keep Plant Alive',
      short_name: 'PlantCare',
      description: 'Gérez l\'arrosage de vos plantes',
      theme_color: '#16a34a',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      id: '/',
      icons: [
        { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icons/pwa-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,woff2,ico}']
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },

  runtimeConfig: {
    public: {
      plantnetApiKey: '',
      openweatherApiKey: ''
    }
  }
})
