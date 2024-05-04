import { defineConfig } from 'alemonjs'
const NODE_ENV = process.env.NODE_ENV
const scripts = NODE_ENV == 'production' ? 'dist/index.js' : 'src/main.ts'
console.info('[APP] 凡人修仙 启动', NODE_ENV, scripts)
export default defineConfig({
  app: {
    scripts
  },
  plugin: {
    init: false
  }
})
