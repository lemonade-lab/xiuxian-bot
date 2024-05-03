import { defineConfig } from 'alemonjs'
export default defineConfig({
  app: {
    scripts: 'dist/index.js'
  },
  plugin: {
    init: false
  }
})
