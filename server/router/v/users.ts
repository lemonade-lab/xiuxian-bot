import koaRouter from 'koa-router'
const router = new koaRouter({ prefix: '/api/v1/users' })

/**
 * 重置密码
 * x-wwww-from-urlencoded
 */
router.put('/password', async ctx => {
  ctx.body = {
    code: 2000,
    msg: '待生产'
  }
})

export default router
