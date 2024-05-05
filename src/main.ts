import { createApp } from 'alemonjs'
import * as apps from './apps.js'
import * as test from './app-test.js'
import { event } from './rules.js'
const app = createApp(import.meta.url)
if (process.env.APP_TEXT == '0') {
  app.use(test)
} else {
  // app.use(apps)
  app.use(event.ok())
}
app.mount()
