import koaRouter from 'koa-router'

const router = new koaRouter({ prefix: '/api' })

/**
 * 重置密码
 * x-wwww-from-urlencoded
 */
router.put('/password', async ctx => {
  /**
   * tudo
   */
  const body = ctx.request.body as {
    username: string
    mail: string
    phone: string
  }
  /**
   * 拦截非法请求
   */
  if (!body || !body?.mail || !body?.phone) {
    ctx.body = {
      code: 4000,
      msg: '非法请求'
    }
    return
  }
  ctx.body = {
    code: 2000,
    msg: '待生产'
  }
})

export default router
