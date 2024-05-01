import koaRouter from 'koa-router'
import { OK_CODE } from '../../config/ajax.js'
const router = new koaRouter({ prefix: '/api/v1/users' })

/**
 * 重置密码
 * x-wwww-from-urlencoded
 */
router.put('/password', async ctx => {
  ctx.body = {
    code: OK_CODE,
    msg: '待生产'
  }
})

export default router
