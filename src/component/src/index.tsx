import { join } from 'path'
import { ImageComponent } from './main.js'
import { importPath } from 'alemonjs'
// getPath
const app = importPath(import.meta.url)
// cwd
const cwd = app.cwd()
export default new ImageComponent(join(cwd, 'public', 'cache'))
export * from './main.js'
export * from './core/index.js'
