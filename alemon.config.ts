import './src/postcss.js'
import { defineConfig } from 'alemonjs'
import { alias, files } from 'alemonjs/plugins'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
export default defineConfig({
  build: {
    plugins: [
      alias({
        entries: [
          { find: '@xiuxian', replacement: join(__dirname, 'src', 'xiuxian') },
          { find: '@public', replacement: join(__dirname, 'public') },
          { find: '@assets', replacement: join(__dirname, 'assets') },
          { find: '@src', replacement: join(__dirname, 'src') }
        ]
      }),
      files({ filter: /\.(png|jpg|css)$/ })
    ]
  }
})
