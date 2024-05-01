import koaRouter from 'koa-router'
import { user } from '../../../src/db/index.js'
import { ERROE_CODE, OK_CODE } from '../../config/ajax.js'
const router = new koaRouter({ prefix: '/api/v1/users' })
/**
 * 获取玩家最新操作记录
 */
router.get('/jwt', async ctx => {
  // 获取 GET 请求的 query 数据
  await user
    .findOne({
      where: {
        id: ctx.state.user.id
      },
      raw: true
    })
    .then(res => {
      if (res) {
        ctx.body = {
          code: OK_CODE,
          msg: '登录成功',
          data: null
        }
        return
      }
      ctx.body = {
        code: ERROE_CODE,
        msg: '账号或密码错误',
        data: null
      }
    })
    .catch(err => {
      console.log('err', err)
      ctx.body = {
        code: ERROE_CODE,
        msg: '服务器错误',
        data: null
      }
    })
})
/**
 * 校验token并得到ws-url
 */
router.get('/geteway', async ctx => {
  // 返回url
  ctx.body = {
    code: OK_CODE,
    msg: '请求成功',
    data: null
  }
})
export default router
