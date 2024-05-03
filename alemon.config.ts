import { defineConfig } from 'alemonjs'
const scripts =
  process.env.NODE_ENV == 'production' ? 'dist/index.js' : 'src/main.ts'

console.info('[APP] 凡人修仙 启动', process.env.NODE_ENV, scripts)
export default defineConfig({
  app: {
    scripts
  },
  plugin: {
    init: false
  }
})
