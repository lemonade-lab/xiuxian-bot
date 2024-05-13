import { createApp } from 'alemonjs'
import * as apps from './apps.js'
import sky from './message/sky.js'
const app = createApp(import.meta.url)
for (const key in apps) {
  app.use(apps[key])
}
app.use(sky)
app.mount()
