import { createApp } from 'alemonjs'
import { readdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dir = join(dirname(__filename), 'apps')

// 读取并过滤文件
const files = readdirSync(dir).filter(file => /\.(ts|js)$/.test(file))

// 创建应用
const app = createApp(import.meta.url)

// 异步加载模块
async function loadModules() {
  for (const file of files) {
    const name = file.replace(/\.(ts|js)$/, '')
    try {
      const module = await import(`file://${join(dir, file)}`)
      if (module.default && module.default.ok) {
        app.use(module.default.ok)
      } else {
        console.log(`未进行默认导出或缺少 'ok' 属性: ${name}`)
      }
    } catch (error) {
      console.error(`加载模块 ${name} 时出错:`, error)
    }
  }
}

// 主函数
async function main() {
  try {
    await loadModules()
    app.mount()
  } catch (error) {
    console.error('应用启动失败:', error)
  }
}

await main()
