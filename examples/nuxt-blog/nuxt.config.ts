export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  telemetry: false,
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@dualmark/nuxt'
  ],
  dualmark: {
    siteUrl: 'http://localhost:3000',
    collections: {
      blog: {
        converter: 'blog',
      }
    }
  }
})
