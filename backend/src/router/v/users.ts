import koaRouter from 'koa-router'
import { ERROE_CODE, OK_CODE } from '../../config/ajax.js'
import { UserType, user } from 'xiuxian-db'
import { getKillList } from 'xiuxian-statistics'
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

router.get('/message', async ctx => {
  const UID = ctx.state.user.uid

  await user
    .findOne({
      where: {
        uid: UID
      },
      raw: true
    })
    .then((res: any) => res)
    .then((res: UserType) => {
      if (res) {
        ctx.body = {
          code: OK_CODE,
          msg: '查询成功',
          data: res
        }
        return
      }
      ctx.body = {
        code: ERROE_CODE,
        msg: '查询错误',
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

/**
 * 杀神榜单
 */
router.get('/klist', async ctx => {
  const UID = ctx.state.user.uid
  try {
    const UserData = await user.findOne({
      attributes: ['uid'],
      where: {
        uid: UID
      },
      raw: true
    })

    if (!UserData) {
      ctx.body = {
        code: 'ERROR_CODE',
        msg: '查询错误',
        data: null
      }
      return
    }

    const res = await getKillList() // 假设这个函数是你定义的获取列表的方法

    if (res) {
      ctx.body = {
        code: 'OK_CODE',
        msg: '查询成功',
        data: res
      }
    } else {
      ctx.body = {
        code: 'ERROR_CODE',
        msg: '查询错误',
        data: null
      }
    }
  } catch (err) {
    console.log(err)
    ctx.body = {
      code: 'ERROR_CODE',
      msg: '服务器错误',
      data: null
    }
  }
})

export default router
