import koaRouter from 'koa-router'
import { user, user_equipment } from 'xiuxian-db'
import { ERROE_CODE, OK_CODE } from '../../config/ajax'

import * as GameApi from 'xiuxian-core'

const router = new koaRouter({ prefix: '/api/v1/equipment' })

router.get('/addEquipment', async ctx => {
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
  const thing = await GameApi.Bag.searchBagByName(UID, thingName as string)
  if (!thing) {
    ctx.body = {
      code: ERROE_CODE,
      msg: `没有[${thingName}]`,
      data: null
    }
    return
  }
  /**
   * 读取装备数据
   */
  const equipment = await user_equipment
    .findAll({ where: { uid: UID } })
    .then(res => res.map(item => item.dataValues))
  /**
   * 装备数上限
   */
  if (equipment.length >= GameApi.Cooling.myconfig_equipment) {
    ctx.body = {
      code: ERROE_CODE,
      msg: `拿不下了`,
      data: null
    }
    return
  }
  // 装备
  await user_equipment.create({ uid: UID, name: thing.name })

  // 扣除物品
  await GameApi.Bag.reduceBagThing(UID, [
    {
      name: thing.name,
      acount: 1
    }
  ])
  // 响应消息

  const UserData = await user
    .findOne({ where: { uid: UID } })
    .then(res => res.dataValues)
  // 更新
  await GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now)
  // 响应
  ctx.body = {
    code: OK_CODE,
    msg: `装备[${thingName}]`,
    data: null
  }

  return
})

/**
 * 卸下
 */
router.get('/deleteEquipment', async ctx => {
  const UID = ctx.state.user.uid
  const thingName = ctx.query.thingName as string
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
  const equipment = await user_equipment
    .findAll({ where: { uid: UID } })
    .then(res => res.map(item => item.dataValues))
  const islearned = equipment.find(item => item.name == thingName)
  if (!islearned) {
    ctx.body = {
      code: ERROE_CODE,
      msg: `装备${thingName}不存在`,
      data: null
    }
  }
  const UserData = await user
    .findOne({ where: { uid: UID } })
    .then(res => res.dataValues)
  // 检查背包
  const BagSize = await GameApi.Bag.backpackFull(UID)
  if (!BagSize) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '储物袋空间不足',
      data: null
    }
    return
  }

  await user_equipment.destroy({
    where: { uid: UID, name: thingName, id: islearned.id }
  })

  await GameApi.Bag.addBagThing(UID, [
    {
      name: thingName,
      acount: 1
    }
  ])
  // 更新
  await GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now)
  ctx.body = {
    code: OK_CODE,
    msg: `卸下[${thingName}]`,
    data: null
  }
  return
})

export default router
