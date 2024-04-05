import { APlugin, type AEvent } from 'alemonjs'
import { DB, GameApi, isThereAUserPresent } from '../../api/index.js'

const reGiveup = {}

export class Destiny extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?炼化[\u4e00-\u9fa5]+$/, fnc: 'refining' },
        { reg: /^(#|\/)?本命$/, fnc: 'benming' },
        { reg: /^(#|\/)?精炼$/, fnc: 'refine' },
        { reg: /^(#|\/)?命解$/, fnc: 'giveup' }
      ]
    })
  }

  /**
   * 炼化
   * @param e
   * @returns
   */
  async refining(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    // 检查是否已有卡槽
    const T: DB.UserFateType = (await DB.user_fate.findOne({
      where: {
        uid: UID
      },
      raw: true
    })) as any
    if (T) {
      e.reply(['已有本命物品'], {
        quote: e.msg_id
      })
      return
    }
    // 检查物品
    const thingName = e.msg.replace(/^(#|\/)?炼化/, '')
    const bagThing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!bagThing) {
      e.reply([`没[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    // 根据物品等级来消耗修为  1000
    const size = bagThing.grade * 1000
    // 看看经验
    const LevelMsg = await GameApi.Levels.read(UID, 1)
    if (LevelMsg.experience < size) {
      e.reply([`需要消耗[修为]*${size}~`], {
        quote: e.msg_id
      })
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
    await GameApi.Bag.reduceBagThing(UID, [{ name: thingName, acount: 1 }])
    // 更新面板?
    await GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now)
    // 返回
    e.reply([`成功炼化[${bagThing.name}]`], {
      quote: e.msg_id
    })
    return
  }

  /**
   * 本命
   * @param e
   * @returns
   */
  async benming(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    // 查看本命信息：武器名/等级/属性/精炼需要消耗提示
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
      e.reply(['未有本命物品'], {
        quote: e.msg_id
      })
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
    const exp_soul = await GameApi.Levels.read(UID, 3).then(
      res => res.experience
    )

    const goodThing = await GameApi.Goods.searchAllThing(thing.name)

    // 精炼等级*1000*物品等级
    const size = 1000 * goodThing.grade

    e.reply([
      `\n本命物:${thing.name}`,
      `\n等级:${thing.grade}`,
      `\n属性:${await GameApi.Talent.getTalentName(thing['good.talent'])}`,
      `\n精炼所需物品:${thing.name}`,
      `\n精炼所需灵石:${size}`,
      `\n精炼所需修为:${exp_gaspractice}/${data.exp_gaspractice}`,
      `\n精炼所需气血:${exp_bodypractice}/${data.exp_bodypractice}`,
      `\n精炼所需魂念:${exp_soul}/${data.exp_soul}`
    ])
    return
  }

  /**
   *
   * @param e
   * @returns
   */
  async refine(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const thing: DB.UserFateType = (await DB.user_fate.findOne({
      where: {
        uid: UID
      },
      raw: true
    })) as any
    if (!thing) {
      e.reply(['未有本命物品'], {
        quote: e.msg_id
      })
      return
    }
    if (thing.grade == 10) {
      e.reply(['本命物品品质已至仙品'], {
        quote: e.msg_id
      })
      return
    }
    // 精炼是否有同名
    const bagThing = await GameApi.Bag.searchBagByName(UID, thing.name)
    if (!bagThing) {
      e.reply([`没[${thing.name}]`], {
        quote: e.msg_id
      })
      return
    }
    // 精炼等级*1000*物品等级
    const size = 1000 * bagThing.grade
    // 是否拥有固定灵石
    const lingshi = await GameApi.Bag.searchBagByName(UID, '下品灵石')
    if (!lingshi || lingshi.acount < size) {
      e.reply([`需要[下品灵石]*${size}] `])
      return
    }

    // 得到门槛所需
    const udata: DB.fateLevelType = (await DB.fate_level.findOne({
      where: {
        grade: thing.grade
      }
    })) as any

    // 得到境界剩余经验
    const exp_gaspractice = await GameApi.Levels.read(UID, 1).then(
      res => res.experience
    )

    const exp_bodypractice = await GameApi.Levels.read(UID, 2).then(
      res => res.experience
    )

    const exp_soul = await GameApi.Levels.read(UID, 3).then(
      res => res.experience
    )

    if (
      exp_gaspractice < udata.exp_gaspractice ||
      exp_bodypractice < udata.exp_bodypractice ||
      exp_soul < udata.exp_soul
    ) {
      // 满足条件
      e.reply(['当前[修为/气血/神念]不足以精炼本名物品'], {
        quote: e.msg_id
      })
      return
    }

    // 减少物品 | 灵石
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: thing.name,
        acount: 1
      },
      {
        name: '下品灵石',
        acount: size
      }
    ])

    // 减少经验
    await GameApi.Levels.reduceExperience(UID, 1, udata.exp_gaspractice)
    await GameApi.Levels.reduceExperience(UID, 2, udata.exp_bodypractice)
    await GameApi.Levels.reduceExperience(UID, 3, udata.exp_soul)

    const grade = thing.grade + 1

    // 更新精炼等级
    await DB.user_fate.update(
      {
        grade: grade
      },
      {
        where: {
          uid: UID
        }
      }
    )

    e.reply([`[${thing.name}]精炼至${grade}级`], {
      quote: e.msg_id
    })

    return
  }

  /**
   *
   * @param e
   * @returns
   */
  async giveup(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return

    const thing: DB.UserFateType = (await DB.user_fate.findOne({
      where: {
        uid: UID
      },
      raw: true
    })) as any
    //
    if (!thing) {
      e.reply(['未有本命物品'], {
        quote: e.msg_id
      })
      return
    }

    // 不存在 或者过期了
    if (!reGiveup[UID] || reGiveup[UID] + 30000 < new Date().getTime()) {
      reGiveup[UID] = new Date().getTime()
      e.reply(['[重要提示]\n请30s内再次发送[(#|/)命解]', '\n以确认命解'], {
        quote: e.msg_id
      })
      return
    }

    // 根据物品等级来消耗气血  1000
    const size = thing.grade * 1000
    // 看看经验
    const LevelMsg = await GameApi.Levels.read(UID, 2)
    if (LevelMsg.experience < size) {
      e.reply([`需要消耗[气血]*${size}~`], {
        quote: e.msg_id
      })
      return
    }
    //
    const UserData = await GameApi.Users.read(UID)
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
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
    e.reply([`成功从灵根处取出[${thing.name}]`], {
      quote: e.msg_id
    })
    return
  }
}
