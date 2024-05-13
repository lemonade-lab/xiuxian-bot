import koaRouter from 'koa-router'
import { user } from '../../../src/db/models.js'
import { GameApi } from '../../../src/api/index.js'
import { ERROE_CODE, OK_CODE } from '../../config/ajax'
const router = new koaRouter({ prefix: '/api/v1/equipment' })

router.get('/addEquipment',async ctx=>{
  const UID = ctx.state.user.uid
  const thingName=ctx.query.thingName
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
  const thing = await GameApi.Bag.searchBagByName(UID,thingName as string)
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
    const equipment = await GameApi.Equipment.get(UID)
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
    await GameApi.Equipment.add(UID, thing.name)
    // 扣除物品
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: thing.name,
        acount: 1
      }
    ])
    // 响应消息
    setTimeout(async () => {
      const UserData = await GameApi.Users.read(UID)
      // 更新
      await GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now)
      // 响应
      ctx.body = {
        code: OK_CODE,
        msg: `装备[${thingName}]`,
        data: null
    }
    }, 1500)
    return
})  

/**
 * 卸下
 */
router.get("/deleteEquipment",async ctx=>{
  const UID = ctx.state.user.uid
  const thingName=ctx.query.thingName
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
  const thing = await GameApi.Bag.searchBagByName(UID,thingName as string)
    if (!thing) {
      ctx.body = {
      code: ERROE_CODE,
      msg: `没有[${thingName}]`,
      data: null
    }
      return
    }
    const equipment = await GameApi.Equipment.get(UID)
    const islearned = equipment.find(item => item.name == thingName)
    if (!islearned) return
    const UserData = await GameApi.Users.read(UID)
    // 检查背包
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    if (!BagSize) {
      ctx.body = {
      code: ERROE_CODE,
      msg: '储物袋空间不足',
      data: null
    }
      return
    }
    setTimeout(async () => {
      const UserData = await GameApi.Users.read(UID)
      // 更新
      await GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now)
      ctx.body = {
        code: OK_CODE,
        msg: `卸下[${thingName}]`,
        data: null
    }
    }, 1500)
    return
  }
)


export default router