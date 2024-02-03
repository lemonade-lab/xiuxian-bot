import { createApp } from 'alemonjs'
import * as apps from './src/apps.js'
createApp(import.meta.url)
  .use(apps)
  .mount()
console.info('[APP] 凡人修仙 启动')
