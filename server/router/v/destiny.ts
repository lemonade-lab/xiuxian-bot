import { ERROE_CODE, OK_CODE } from '../../config/ajax'
import { user } from 'xiuxian-db'
import koaRouter from 'koa-router'

import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'

const router = new koaRouter({ prefix: '/api/v1/destiny' })
const reGiveup = {}

/**
 * 炼化
 */

router.get('/refining', async ctx => {
  const UID = ctx.state.user.uid
  const thingName = ctx.query.thingName
  const UserData1 = (await user.findOne({
    where: {
      uid: UID
    }
  })) as any
  //判断用户是否存在
  if (!UserData1) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '查询错误',
      data: null
    }
    return
  }
  // 检查是否已有卡槽
  const T: DB.UserFateType = (await DB.user_fate.findOne({
    where: {
      uid: UID
    },
    raw: true
  })) as any
  if (T) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '已有本命物品',
      data: null
    }
    return
  }
  const bagThing = await GameApi.Bag.searchBagByName(UID, thingName as string)
  if (!bagThing) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '已有本命物品',
      data: null
    }
    return
  }
  // 根据物品等级来消耗修为  1000
  const size = bagThing.grade * 1000
  // 看看经验
  const LevelMsg = await GameApi.Levels.read(UID, 1)
  if (LevelMsg.experience < size) {
    ctx.body = {
      code: OK_CODE,
      msg: `需要消耗[修为]*${size}~`,
      data: null
    }
    return
  }
  // 减少修为
  await GameApi.Levels.reduceExperience(UID, 1, size)
  // 新增数据
  await DB.user_fate.create({
    uid: UID,
    name: bagThing.name,
    grade: 0
  } as DB.UserFateType)
  const UserData = await GameApi.Users.read(UID)
  // 减少物品
  await GameApi.Bag.reduceBagThing(UID, [
    { name: thingName as string, acount: 1 }
  ])
  // 更新面板?
  await GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now)
  // 返回
  ctx.body = {
    code: OK_CODE,
    msg: `成功炼化[${bagThing.name}]`,
    data: null
  }
  return
})

/**
 * 查看本命
 */
router.get('/benming', async ctx => {
  const UID = ctx.state.user.uid
  const UserData1 = (await user.findOne({
    where: {
      uid: UID
    }
  })) as any
  //判断用户是否存在
  if (!UserData1) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '用户不存在',
      data: null
    }
    return
  }

  const thing: DB.UserFateType = (await DB.user_fate.findOne({
    where: {
      uid: UID
    },
    include: {
      model: DB.goods
    },
    raw: true
  })) as any
  //
  if (!thing) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '未有本命物品',
      data: null
    }
    return
  }
  // 查看消耗所需
  const data: DB.fateLevelType = (await DB.fate_level.findOne({
    where: {
      grade: thing.grade
    },
    raw: true
  })) as any

  // 得到该境界经验
  const exp_gaspractice = await GameApi.Levels.read(UID, 1).then(
    res => res.experience
  )
  const exp_bodypractice = await GameApi.Levels.read(UID, 2).then(
    res => res.experience
  )
  const exp_soul = await GameApi.Levels.read(UID, 3).then(res => res.experience)

  const goodThing = await GameApi.Goods.searchAllThing(thing.name)

  // 精炼等级*1000*物品等级
  const size = 1000 * goodThing.grade

  const msg: string =
    `\n本命物:${thing.name}` +
    `\n等级:${thing.grade}` +
    `\n属性:${await GameApi.Talent.getTalentName(thing['good.talent'])}` +
    `\n精炼所需物品:${thing.name}` +
    `\n精炼所需灵石:${size}` +
    `\n精炼所需修为:${exp_gaspractice}/${data.exp_gaspractice}` +
    `\n精炼所需气血:${exp_bodypractice}/${data.exp_bodypractice}` +
    `\n精炼所需魂念:${exp_soul}/${data.exp_soul}`

  ctx.body = {
    code: OK_CODE,
    msg: msg,
    data: null
  }
  return
})

router.get('/giveup', async ctx => {
  const UID = ctx.state.user.uid
  const UserData1 = (await user.findOne({
    where: {
      uid: UID
    }
  })) as any
  //判断用户是否存在
  if (!UserData1) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '查询错误',
      data: null
    }
    return
  }
  const thing: DB.UserFateType = (await DB.user_fate.findOne({
    where: {
      uid: UID
    },
    raw: true
  })) as any
  //
  if (!thing) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '未有本命物品',
      data: null
    }
    return
  }

  // 不存在 或者过期了
  if (!reGiveup[UID] || reGiveup[UID] + 30000 < new Date().getTime()) {
    reGiveup[UID] = new Date().getTime()
    ctx.body = {
      code: OK_CODE,
      msg: '[重要提示]\n请30s内再次发送[/命解]' + '\n以确认命解',
      data: null
    }
    return
  }

  // 根据物品等级来消耗气血  1000
  const size = thing.grade * 1000
  // 看看经验
  const LevelMsg = await GameApi.Levels.read(UID, 2)
  if (LevelMsg.experience < size) {
    ctx.body = {
      code: OK_CODE,
      msg: `需要消耗[气血]*${size}~`,
      data: null
    }
    return
  }
  //
  const UserData = await GameApi.Users.read(UID)
  const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
  // 背包未位置了直接返回了
  if (!BagSize) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '储物袋空间不足',
      data: null
    }
    return
  }

  // 清除询问
  delete reGiveup[UID]

  // 减少气血
  await GameApi.Levels.reduceExperience(UID, 1, size)
  // 返回物品
  await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
    {
      name: thing.name,
      acount: thing.grade + 1
    }
  ])
  // 删除数据
  await DB.user_fate.destroy({
    where: {
      uid: UID
    }
  })
  // 返回
  ctx.body = {
    code: OK_CODE,
    msg: `成功从灵根处取出[${thing.name}]`,
    data: null
  }
  return
})

export default router
