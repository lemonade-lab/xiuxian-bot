import { isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
import { Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    // 操作锁
    const T = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }
    // 检查用户
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const thing = await DB.user_fate
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)
    //
    if (!thing) {
      Send(Text('未有本命物品'))
      return
    }
    if (thing.grade == 10) {
      Send(Text('本命物品品质已至仙品'))
      return
    }
    // 精炼是否有同名
    const bagThing = await GameApi.Bag.searchBagByName(UID, thing.name)
    if (!bagThing) {
      Send(Text(`没[${thing.name}]`))
      return
    }
    // 精炼等级*1000*物品等级
    const size = 1000 * bagThing.grade
    // 是否拥有固定灵石
    const lingshi = await GameApi.Bag.searchBagByName(UID, '下品灵石')
    if (!lingshi || lingshi.acount < size) {
      Send(Text(`需要[下品灵石]*${size}`))
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
    const exp_gaspractice = await DB.user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 1
        }
      })
      .then(res => res?.dataValues)
      .then(res => res.experience)

    const exp_bodypractice = await DB.user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 2
        }
      })
      .then(res => res?.dataValues)
      .then(res => res.experience)

    const exp_soul = await DB.user_level
      .findOne({
        attributes: ['addition', 'realm', 'experience'],
        where: {
          uid: UID,
          type: 3
        }
      })
      .then(res => res?.dataValues)
      .then(res => res.experience)

    if (
      exp_gaspractice < udata.exp_gaspractice ||
      exp_bodypractice < udata.exp_bodypractice ||
      exp_soul < udata.exp_soul
    ) {
      Send(Text('当前[修为/气血/神念]不足以精炼本名物品'))
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
    Send(Text(`[${thing.name}]精炼至${grade}级`))
  },
  'message.create',
  /^(#|\/)?精炼$/
)
