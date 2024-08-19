import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { Redis, user, user_equipment } from 'xiuxian-db'
export default new Messages().response(
  /^(#|\/)?(装备|裝備)[\u4e00-\u9fa5]+$/,
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const KEY = `xiuxian:open:${e.user_id}`
    const LOCK = await Redis.get(KEY)
    if (LOCK) {
      e.reply('操作频繁')
      return
    }
    await Redis.set(KEY, 1, 'EX', 6)
    /**
     * lock end
     */

    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const thingName = e.msg.replace(/^(#|\/)?(装备|裝備)/, '')
    /**
     * 搜索装备
     */
    const thing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!thing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
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
      e.reply(['拿不下了'], {
        quote: e.msg_id
      })
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
    setTimeout(async () => {
      const UserData = await user
        .findOne({
          where: {
            uid: UID
          }
        })
        .then(res => res.dataValues)
      // 更新
      await GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now)
      // 响应
      e.reply([`装备[${thingName}]`], {
        quote: e.msg_id
      })
    }, 1500)
    return
  }
)
