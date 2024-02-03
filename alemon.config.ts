import 'afloat/utils/logs'
import { defineConfig } from 'alemonjs'
import icqq from 'alemon-icqq'
export default defineConfig({
  platforms: [icqq],
  app: {
    scripts: 'main.ts'
  },
  plugin: {
    init: false
  }
})
