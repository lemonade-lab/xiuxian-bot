import koaRouter from 'koa-router'
import * as GameApi from 'xiuxian-core'
import { State } from 'xiuxian-core'
import { ERROE_CODE, OK_CODE } from '../../config/ajax'
import { user } from 'xiuxian-db'
const router = new koaRouter({ prefix: '/api/v1/ore' })

router.get('/1', async ctx => {
  console.log(1)
  ctx.body = {
    code: 'ERROR_CODE',
    msg: '查询错误',
    data: null
  }
  return
})

/**
 * 探索灵矿
 */
router.get('/search', async ctx => {
  const UID = ctx.state.user.uid
  const UserData = (await user.findOne({
    where: {
      uid: UID
    }
  })) as any
  //判断用户是否存在
  if (!UserData) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '查询错误',
      data: null
    }
    return
  }
  //判断血量
  const { state } = await State.goByBlood(UserData)
  if (state == 4001) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '血量不足',
      data: null
    }
    return
  }
  //判断位置
  if (UserData.pont_attribute == 1) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '[城主府]巡逻军:\n城内切莫释放神识!',
      data: null
    }
    return
  }
  //得到位置名
  const name = await GameApi.Map.getPlaceName(
    UserData.point_type,
    UserData.pont_attribute
  )
  // 消息
  const msg: string[] = [`[${name}]的灵矿`]
  // 得到灵矿
  const explore = await GameApi.explore.explorecache(UserData.point_type)
  for (const item in explore) {
    msg.push(
      `\n🔹标记:${item}(${getMoneyGrade(explore[item].grade)}灵矿)*${
        explore[item].acount
      }`
    )
  }
  ctx.body = {
    code: OK_CODE,
    msg: msg,
    data: null
  }
})

function getMoneyGrade(grade: number) {
  if (grade == 1) return '下品'
  if (grade == 2) return '中品'
  if (grade == 3) return '上品'
  if (grade == 4) return '极品'
}

export default router
