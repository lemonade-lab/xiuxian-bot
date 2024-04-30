import './utils/env.js'
import Koa from 'koa'
import KoaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import cors from 'koa-cors'

import MainRouters from './router/main.js'
import IndexRouters from './router/index.js'

import { authMiddleware } from './utils/jwt.js'

// new
const app = new Koa()
const PORT = Number(process.env?.APP_SERVER_PORT ?? 9090)

// static
app.use(KoaStatic('resources'))
// 允许跨域
app.use(cors())
app.use(bodyParser())

for (const item of MainRouters) {
  // routes
  app.use(item.routes())
}

// 此后的api受到jwt保护
app.use(authMiddleware)

for (const item of IndexRouters) {
  // routes
  app.use(item.routes())
}

// listen
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT)
  console.log('http://localhost:' + PORT)
})
