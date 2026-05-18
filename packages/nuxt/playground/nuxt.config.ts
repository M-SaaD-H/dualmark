import { defineNuxtConfig } from 'nuxt/config'
import DualmarkNuxt from '../src/module'

export default defineNuxtConfig({
  modules: [DualmarkNuxt],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  dualmark: {
    siteUrl: 'http://localhost:3000'
  }
})
