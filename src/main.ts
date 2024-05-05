import { createApp } from 'alemonjs'
import * as apps from './apps.js'
import * as test from './app-test.js'
// import { Events } from './alemonjs.js'
// import message from './rule.js'
if (process.env.APP_TEXT == '0') {
  createApp(import.meta.url)
    .use(test)
    .mount()
} else {
  // 创建事件
  // const event = new Events()
  // event.use(message.ok())
  createApp(import.meta.url)
    // .use(event.ok())
    .use(apps)
    .mount()
}
