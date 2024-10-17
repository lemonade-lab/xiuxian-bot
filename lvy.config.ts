import { defineConfig } from 'lvyjs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import { onStart } from 'alemonjs'
export default defineConfig({
  plugins: [
    {
      name: 'alemon',
      useApp: () => {
        if (process.argv.includes('--alemonjs')) {
          onStart('src/index.ts')
        }
      }
    },
    {
      name: 'jsxp',
      useApp: async () => {
        if (process.argv.includes('--view')) {
          const { createServer } = await import('jsxp')
          createServer()
        }
      }
    }
  ],
  build: {
    alias: {
      entries: [{ find: '@src', replacement: join(__dirname, 'src') }]
    },
    typescript: {
      // 去除注释
      removeComments: true
    }
  }
})
