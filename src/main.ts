import { createApp } from 'alemonjs'
import * as apps from './apps.js'
const app = createApp(import.meta.url)
for (const key in apps) {
  app.use(apps[key])
}
app.mount()
