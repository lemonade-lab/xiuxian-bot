import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?精炼$/, async e => {
  /**
   * *******
   * lock start
   * *******
   */
  const KEY = `xiuxian:open:${e.user_id}`
  const LOCK = await DB.Redis.get(KEY)
  if (LOCK) {
    e.reply('操作频繁')
    return
  }
  await DB.Redis.set(KEY, 1, 'EX', 6)
  /**
   * lock end
   */

  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const thing = await DB.user_fate
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)
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
  const udata = await DB.fate_level
    .findOne({
      where: {
        grade: thing.grade
      }
    })
    .then(res => res?.dataValues)

  // 得到境界剩余经验
  const exp_gaspractice = await GameApi.Levels.read(UID, 1).then(
    res => res.experience
  )

  const exp_bodypractice = await GameApi.Levels.read(UID, 2).then(
    res => res.experience
  )

  const exp_soul = await GameApi.Levels.read(UID, 3).then(res => res.experience)

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
})
