import { createApp } from 'alemonjs'
import * as apps from './src/apps.js'
import * as test from './src/app-test.js'
if ((process.env.APP_TEXT = '0')) {
  createApp(import.meta.url)
    .use(test)
    .mount()
} else {
  createApp(import.meta.url)
    .use(apps)
    .mount()
}
console.info('[APP] 凡人修仙 启动')
