import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?(装备|裝備)[\u4e00-\u9fa5]+$/,
  async e => {
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
    const equipment = await GameApi.Equipment.get(UID)
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
      e.reply([`装备[${thingName}]`], {
        quote: e.msg_id
      })
    }, 1500)
    return
  }
)
