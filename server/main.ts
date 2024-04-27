import './utils/env.js'
import Koa from 'koa'
import KoaStatic from 'koa-static'
import KoaBody from 'koa-body'
import cors from 'koa-cors'
import file from './router/file.js'
import users from './router/users.js'
import { authMiddleware } from './utils/jwt.js'

// new
const app = new Koa()
const PORT = Number(process.env?.APP_SERVER_PORT ?? 9090)

// static
app.use(KoaStatic('resources'))
// 允许跨域
app.use(cors())
app.use(KoaBody())

// routes
app.use(users.routes())

// 此后的api受到jwt保护
app.use(authMiddleware)

// routes
app.use(file.routes())

// listen
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT)
  console.log('http://localhost:' + PORT)
})
