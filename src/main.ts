import { createApp } from 'alemonjs'
import * as apps from './apps.js'
import * as test from './test/index.js'
if (process.env.test == '0') {
  createApp(import.meta.url)
    .use(test)
    .mount()
} else {
  createApp(import.meta.url)
    .use(apps)
    .mount()
}
