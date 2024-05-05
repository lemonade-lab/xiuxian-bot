import { createApp } from 'alemonjs'
import * as apps from './apps.js'
import * as test from './app-test.js'
import { event } from './rules.js'
if (process.env.APP_TEXT == '0') {
  createApp(import.meta.url)
    .use(test)
    .mount()
} else {
  for (const item in apps) {
    event.use(apps[item])
  }
  createApp(import.meta.url)
    .use(event.ok())
    .mount()
}
