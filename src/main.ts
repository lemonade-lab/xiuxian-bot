import { createApp } from 'alemonjs'
import { readdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
// 获取当前目录
const __filename = fileURLToPath(import.meta.url)
const dir = join(dirname(__filename), 'apps')
// 读取文件
const files = readdirSync(dir).filter(file => /.(ts|js)$/.test(file))
// 载入
const promises = files.map(file => import(`file://${join(dir, file)}`))
// 创建
const app = createApp(import.meta.url)
try {
  const results = await Promise.allSettled(promises)
  for (const [index, result] of results.entries()) {
    const name = files[index].replace(/.(ts|js)$/, '')
    if (result.status === 'rejected') {
      console.log('解析错误', name, result.reason)
    } else {
      if (result.value.default) {
        app.use(result.value.default.ok)
      } else {
        console.log('未进行默认导出', name)
      }
    }
  }
} catch (error) {
  console.error('加载时出错:', error)
}
app.mount()
