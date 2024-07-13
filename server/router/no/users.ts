import koaRouter from 'koa-router'
import { generateToken } from '../../utils/jwt'
import { user } from 'xiuxian-db'
import { ERROE_CODE, OK_CODE } from '../../config/ajax.js'

const router = new koaRouter({ prefix: '/api/v1/users' })

/**
 * 用户登录
 * x-wwww-from-urlencoded
 */
router.post('/login', async ctx => {
  const body = ctx.request.body as {
    username: string
    password: string
  }

  console.log('body', body)

  /**
   * 拦截非法请求
   */
  if (!body || !body?.password || !body?.username) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '非法请求'
    }
    return
  }

  await user
    .findOne({
      where: {
        email: body.username,
        password: body.password
      },
      raw: true
    })
    .then(res => {
      if (res) {
        ctx.body = {
          code: OK_CODE,
          msg: '登录成功',
          data: {
            token: generateToken(res)
          }
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
      console.log(err)
      ctx.body = {
        code: ERROE_CODE,
        msg: '服务器错误',
        data: null
      }
    })
})

export default router
