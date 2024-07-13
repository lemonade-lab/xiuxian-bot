import './env.js'
import { renderToString } from 'react-dom/server'
import Koa from 'koa'
import KoaStatic from 'koa-static'
import Router from 'koa-router'
import { routes } from './routes.js'
import component from 'xiuxian-component'
import { writeFileSync } from 'fs'
import { join } from 'path'
// new
const app = new Koa()
const router = new Router()
// eslint-disable-next-line react-refresh/only-export-components
const Port = 8080
// for all component
for (const item of routes) {
  router.get(item.url, ctx => {
    // 如果收到了截至指令。就会生产截图真是图片测试
    const req = ctx.request.query
    if (req?.test == 'ok') {
      component.puppeteer
        .toFile(component.create(item.element, 'test', 'test.html'))
        .then(img => {
          if (typeof img !== 'boolean') {
            writeFileSync(
              join(process.cwd(), './resources/cache/test.jpg'),
              img
            )
          }
        })
    }
    const html = renderToString(item.element)
    ctx.body = `<!DOCTYPE html>${html}`
  })
}
// static
app.use(KoaStatic('public'))
// routes
app.use(router.routes())
// listen 800
app.listen(Port, () => {
  console.log('Server is running on port ' + Port)
  console.log('http://localhost:' + Port)
  console.log('http://localhost:' + Port + '?test=ok')
})
