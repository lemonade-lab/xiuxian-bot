import koaRouter from 'koa-router'
import { ERROE_CODE, OK_CODE } from '../../config/ajax.js'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'

import {
  isThereAUserPresent,
  victoryCooling,
  showUserMsg
} from '../../utils/msgapi.js'
import Application from 'koa'
const router = new koaRouter({ prefix: '/api/v1/action' })

/**
 * 模板
 */
router.get('/', async ctx => {
  const UID = ctx.state.user.uid
  if (!(await isThereAUserPresent(UID))) {
    ctx.body = {
      code: OK_CODE,
      msg: `查无此人`,
      data: null
    }
    return
  }
  // const thingName = ctx.query.thingName
})

/**
 * 嗑药
 */
router.get('/take', async ctx => {
  const UID = ctx.state.user.uid
  if (!(await isThereAUserPresent(UID))) {
    ctx.body = {
      code: OK_CODE,
      msg: `查无此人`,
      data: null
    }
    return
  }
  const thingName = ctx.query.thingName
  const thingAcount = ctx.query.thingAcount
  const thing = await GameApi.Bag.searchBagByName(UID, thingName as string)
  if (!thing) {
    ctx.body = {
      code: OK_CODE,
      msg: `没有[${thingName}]`,
      data: null
    }
    return
  }
  if (thing.acount < Number(thingAcount)) {
    ctx.body = {
      code: OK_CODE,
      msg: `数量不足`,
      data: null
    }
    return
  }
  const UserData = await DB.user
    .findOne({ where: { uid: UID } })
    .then(res => res.dataValues)

  switch (thing.addition) {
    case 'boolere_covery': {
      let size = thing.boolere_covery * Number(thingAcount)
      size = size > 100 ? 100 : size
      const blood = await GameApi.Equipment.addBlood(UserData, size)
      ctx.body = {
        code: OK_CODE,
        msg: `💊${thingName}\n恢复了${size}%的血量\n🩸${blood}`,
        data: null
      }
      break
    }
    case 'exp_gaspractice': {
      if (thing.exp_gaspractice <= 0) {
        ctx.body = {
          code: OK_CODE,
          msg: `[修为]+${0}`,
          data: null
        }
        break
      }
      const size = Math.floor(
        (Number(thingAcount) *
          thing.exp_gaspractice *
          (UserData.talent_size + 100)) /
          100
      )
      const { msg } = await GameApi.Levels.addExperience(UID, 1, size)
      ctx.body = {
        code: OK_CODE,
        msg: msg,
        data: null
      }
      break
    }
    case 'exp_bodypractice': {
      const size = Math.floor(
        (Number(thingAcount) *
          thing.exp_bodypractice *
          (UserData.talent_size + 100)) /
          100
      )
      const { msg } = await GameApi.Levels.addExperience(UID, 2, size)
      ctx.body = {
        code: OK_CODE,
        msg: msg,
        data: null
      }
      break
    }
    case 'exp_soul': {
      const size = Math.floor(
        (Number(thingAcount) * thing.exp_soul * (UserData.talent_size + 100)) /
          100
      )
      const { msg } = await GameApi.Levels.addExperience(UID, 3, size)
      ctx.body = {
        code: OK_CODE,
        msg: msg,
        data: null
      }
      break
    }
    default: {
      ctx.body = {
        code: OK_CODE,
        msg: `啥也不是的东东,丢了~`,
        data: null
      }
    }
  }
  await GameApi.Bag.reduceBagThing(UID, [
    {
      name: thing.name,
      acount: Number(thingAcount)
    }
  ])
  return
})

/**
 * 学习
 */
router.get('/study', async ctx => {
  const UID = ctx.state.user.uid
  if (!(await isThereAUserPresent(UID))) return
  const thingName = ctx.query.thingName
  const thing = await GameApi.Bag.searchBagByName(UID, thingName as string)
  if (!thing) {
    ctx.body = {
      code: OK_CODE,
      msg: `没有[${thingName}]`,
      data: null
    }
    return
  }
  const AllSorcery = await DB.user_skills
    .findAll({ where: { uid: UID } })
    .then(res => res.map(item => item.dataValues))
  const islearned = AllSorcery.find(item => item.name == thing.name)
  if (islearned) {
    ctx.body = {
      code: OK_CODE,
      msg: '学过了',
      data: null
    }
    return
  }

  if (AllSorcery.length >= GameApi.Cooling.myconfig_gongfa) {
    ctx.body = {
      code: OK_CODE,
      msg: '反复看了又看\n却怎么也学不进',
      data: null
    }
    return
  }
  /**
   * 新增功法
   */
  DB.user_skills.create({ uid: UID, name: thing.name })

  // 更新天赋
  setTimeout(async () => {
    const UserData = await DB.user
      .findOne({ where: { uid: UID } })
      .then(res => res.dataValues)
    await GameApi.Skills.updataEfficiency(UID, UserData.talent)
  }, 1000)
  await GameApi.Bag.reduceBagThing(UID, [
    {
      name: thing.name,
      acount: 1
    }
  ])
  ctx.body = {
    code: OK_CODE,
    msg: `学习[${thingName}]`,
    data: null
  }
  return
})

/**
 * 忘掉
 */
router.get('/forget', async ctx => {
  const UID = ctx.state.user.uid
  if (!(await isThereAUserPresent(UID))) {
    ctx.body = {
      code: OK_CODE,
      msg: `查无此人`,
      data: null
    }
    return
  }
  const thingName = ctx.query.thingName
  const AllSorcery = await DB.user_skills
    .findAll({ where: { uid: UID } })
    .then(res => res.map(item => item.dataValues))
  const islearned = AllSorcery.find(item => item.name == thingName)
  if (!islearned) {
    ctx.body = {
      code: OK_CODE,
      msg: `没学过[${thingName}]`,
      data: null
    }
    return
  }
  const UserData = await DB.user
    .findOne({ where: { uid: UID } })
    .then(res => res.dataValues)
  /**
   * 检查背包
   */
  const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
  if (!BagSize) {
    ctx.body = {
      code: OK_CODE,
      msg: '储物袋空间不足',
      data: null
    }
    return
  }
  // 直接删

  DB.user_skills.destroy({ where: { uid: UID, name: thingName } })

  /**
   * 更新天赋
   */
  setTimeout(async () => {
    const UserData = await DB.user
      .findOne({ where: { uid: UID } })
      .then(res => res.dataValues)
    await GameApi.Skills.updataEfficiency(UID, UserData.talent)
  }, 500)

  await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
    { name: islearned.name, acount: 1 }
  ])

  ctx.body = {
    code: OK_CODE,
    msg: `忘了[${thingName}]`,
    data: null
  }
  return
})

/**
 * 消耗
 */
router.get('/consumption', async ctx => {
  const UID = ctx.state.user.uid
  if (!(await isThereAUserPresent(UID))) {
    ctx.body = {
      code: OK_CODE,
      msg: `查无此人`,
      data: null
    }
    return
  }
  const thingName = ctx.query.thingName as string
  const thingAcount = ctx.query.thingAcount
  const thing = await GameApi.Bag.searchBagByName(UID, thingName)
  console.log(thing)

  if (!thing) {
    ctx.body = {
      code: OK_CODE,
      msg: `没有[${thingName}]`,
      data: null
    }
    return
  }
  // 检查数量
  if (thing.acount < Number(thingAcount)) {
    ctx.body = {
      code: OK_CODE,
      msg: '数量不足',
      data: null
    }
    return
  }
  if (thing.type != 6) {
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: thing.name,
        acount: Number(thingAcount)
      }
    ])
    ctx.body = {
      code: OK_CODE,
      msg: `[${thingName}]损坏`,
      data: null
    }
    return
  }
  const UserData = await DB.user
    .findOne({ where: { uid: UID } })
    .then(res => res.dataValues)
  switch (thing.id) {
    case 600201: {
      addExperience(
        ctx,
        UID,
        12,
        UserData.talent_size,
        {
          name: thing.name,
          experience: thing.exp_gaspractice
        },
        Number(thingAcount)
      )
      break
    }
    case 600202: {
      addExperience(
        ctx,
        UID,
        20,
        UserData.talent_size,
        {
          name: thing.name,
          experience: thing.exp_gaspractice
        },
        Number(thingAcount)
      )
      break
    }
    case 600203: {
      addExperience(
        ctx,
        UID,
        28,
        UserData.talent_size,
        {
          name: thing.name,
          experience: thing.exp_gaspractice
        },
        Number(thingAcount)
      )
      break
    }
    case 600204: {
      addExperience(
        ctx,
        UID,
        36,
        UserData.talent_size,
        {
          name: thing.name,
          experience: thing.exp_gaspractice
        },
        Number(thingAcount)
      )
      break
    }
    /**
     * 洗灵根
     */
    case 600301: {
      const LevelData = await DB.user_level
        .findOne({
          where: {
            uid: UID,
            type: 1
          }
        })
        .then(res => res.dataValues)
      if (!LevelData) {
        break
      }
      if (LevelData.realm > 24) {
        ctx.body = {
          code: OK_CODE,
          msg: '灵根已定\n此生不可再洗髓',
          data: null
        }
        break
      }
      UserData.talent = GameApi.Talent.getTalent()

      await DB.user.update(
        {
          talent: UserData.talent
        },
        { where: { uid: UID } }
      )

      /**
       * 更新天赋
       */
      setTimeout(async () => {
        await GameApi.Skills.updataEfficiency(UID, UserData.talent)
      }, 500)
      /**
       * 扣物品
       */
      await GameApi.Bag.reduceBagThing(UID, [
        {
          name: thing.name,
          acount: Number(thingAcount)
        }
      ])
      /**
       * 显示资料
       */
      setTimeout(() => {
        showUserMsg(ctx)
      }, 1000)
      break
    }
    /**
     * 望灵珠
     */
    case 600302: {
      UserData.talent_show = 1

      await DB.user.update(
        {
          talent_show: UserData.talent_show
        },
        { where: { uid: UID } }
      )

      /**
       * 扣物品
       */
      await GameApi.Bag.reduceBagThing(UID, [
        {
          name: thing.name,
          acount: Number(thingAcount)
        }
      ])
      /**
       * 显示资料
       */

      await showUserMsg(ctx)

      break
    }
    /**
     * 灵木
     */
    case 600304: {
      const soul = thing.exp_soul * Number(thingAcount)
      /**
       * 扣物品
       */
      await GameApi.Bag.reduceBagThing(UID, [
        {
          name: thing.name,
          acount: Number(thingAcount)
        }
      ])
      /**
       * 增加经验
       */
      await GameApi.Levels.addExperience(UID, 3, soul)
      ctx.body = {
        code: OK_CODE,
        msg: '灵根已定\n此生不可再洗髓',
        data: null
      }
      break
    }
    /**
     * 桃花酿
     */
    case 600306: {
      const soul = thing.exp_soul * Number(thingAcount)
      /**
       * 扣物品
       */
      await GameApi.Bag.reduceBagThing(UID, [
        {
          name: thing.name,
          acount: Number(thingAcount)
        }
      ])
      /**
       * 增加经验
       */
      await GameApi.Levels.addExperience(UID, 3, soul)
      ctx.body = {
        code: OK_CODE,
        msg: '灵根已定\n此生不可再洗髓',
        data: null
      }
      break
    }
    // 金盆
    case 600305: {
      if (UserData.special_prestige <= 0) {
        ctx.body = {
          code: OK_CODE,
          msg: '已心无杂念',
          data: null
        }
        break
      }
      UserData.special_prestige -= Number(thingAcount)
      if (UserData.special_prestige <= 0) {
        UserData.special_prestige = 0
      }
      await DB.user.update(
        {
          special_prestige: UserData.special_prestige
        },
        { where: { uid: UID } }
      )

      /**
       * 扣物品
       */
      await GameApi.Bag.reduceBagThing(UID, [
        {
          name: thing.name,
          acount: Number(thingAcount)
        }
      ])
      ctx.body = {
        code: OK_CODE,
        msg: `成功洗去[煞气]*${thingAcount}~`,
        data: null
      }
      break
    }
    /**
     * 传送符
     */
    case 600402: {
      /**
       * 传送符用来回城池的
       */
      const PositionData = await DB.map_position
        .findAll({
          where: {
            attribute: [1, 6]
          }
        })
        .then(res => res.map(item => item.dataValues))
      const point = {
        type: 0,
        attribute: 0,
        name: '记录',
        x: 0,
        y: 0,
        z: 0
      }
      let closestPosition: null | number = null
      for await (const item of PositionData) {
        const x = (item?.x1 + item?.x2) / 2,
          y = (item?.y1 + item?.y2) / 2,
          z = (item?.z1 + item?.z1) / 2
        const distance = Math.sqrt(
          Math.pow(x - UserData.pont_x, 2) +
            Math.pow(y - UserData.pont_y, 2) +
            Math.pow(z - UserData.pont_z, 2)
        )
        if (!closestPosition || distance < closestPosition) {
          closestPosition = distance
          point.type = item?.type
          point.name = item?.name
          point.attribute = item?.attribute
          point.x = x
          point.y = y
          point.z = z
        }
      }

      await DB.user.update(
        {
          pont_x: point.x,
          pont_y: point.y,
          pont_z: point.z,
          point_type: point.type,
          pont_attribute: point.attribute
        },
        { where: { uid: UID } }
      )

      ctx.body = {
        code: OK_CODE,
        msg: `成功洗去[煞气]*${thingAcount}~`,
        data: null
      }
      /**
       * 扣物品
       */
      await GameApi.Bag.reduceBagThing(UID, [
        {
          name: thing.name,
          acount: Number(thingAcount)
        }
      ])
      break
    }
    /**
     * 引魂灯
     */
    case 600403: {
      // await GameApi.Bag.reduceBagThing(UID, [
      //   {
      //     name: thing.name,
      //     acount: Number(thingAcount)
      //   }
      // ])
      // 还用扣掉物品码？  直接重生了。
      // reCreateMsg(ctx)
      ctx.body = {
        code: OK_CODE,
        msg: '暂不可使用',
        data: null
      }
      break
    }
    /**
     * 开天令
     */
    case 600401: {
      ctx.body = {
        code: OK_CODE,
        msg: '开天令:开辟宗门驻地\n————————\n此物暂未开放',
        data: null
      }
      break
    }
    default: {
      ctx.body = {
        code: OK_CODE,
        msg: 'defalut',
        data: null
      }
      break
    }
  }
  return
})

/**
 *
 * @param e
 * @param UID
 * @param acount
 * @param thing
 * @param realm
 * @param talentsize
 * @returns
 */
async function addExperience(
  ctx: Application.ParameterizedContext,
  UID: string,
  grade: number,
  talentsize: number,
  thing: { name: string; experience: number },
  acount: number
) {
  const ling = await sendLing(ctx, UID, acount)
  if (!ling) {
    // 直接出去
    return
  }
  const { dividend, realm } = ling
  // 过了
  if (realm > grade) {
    return
  }
  const size = Math.floor(
    (acount * thing.experience * (talentsize + 100)) / 100 / dividend
  )
  // 扣物品
  await GameApi.Bag.reduceBagThing(UID, [
    {
      name: thing.name,
      acount: acount
    }
  ])
  // 反馈
  const { msg } = await GameApi.Levels.addExperience(UID, 1, size)
  ctx.body = {
    code: ERROE_CODE,
    msg: msg,
    data: null
  }
  return
}

/**
 *
 * @param e
 * @param UID
 * @param acount
 * @returns
 */
async function sendLing(
  ctx: Application.ParameterizedContext,
  UID: string,
  acount: number
) {
  let dividend = 1
  if (acount > 2200) {
    ctx.body = {
      code: ERROE_CODE,
      msg: '最多仅能2200',
      data: null
    }
    return false
  }
  const CDID = 12,
    CDTime = GameApi.Cooling.CD_Pconst_ractice

  if (!(await victoryCooling(ctx, UID, CDID))) return false

  GameApi.Burial.set(UID, CDID, CDTime)

  const LevelData = await DB.user_level
    .findOne({
      where: {
        uid: UID,
        type: 1
      }
    })
    .then(res => res.dataValues)
  /**
   * 到了筑基,灵石收益成倍削弱
   */
  if (LevelData.realm > 12) {
    dividend = LevelData.realm - 10
    dividend = dividend > 8 ? 8 : dividend
  }
  return {
    realm: LevelData.realm,
    dividend
  }
}

export default router
