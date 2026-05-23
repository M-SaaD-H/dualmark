import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  dualmark: {
    siteUrl: 'https://example.com',
  },
})
