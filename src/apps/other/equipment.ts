import { APlugin, type AEvent } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'

import * as GameApi from 'xiuxian-core'
export class Equipment extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(装备|裝備)[\u4e00-\u9fa5]+$/, fnc: 'addEquipment' },
        { reg: /^(#|\/)?卸下[\u4e00-\u9fa5]+$/, fnc: 'deleteEquipment' }
      ]
    })
  }

  /**
   *装备
   * @param e
   * @returns
   */
  async addEquipment(e: AEvent) {
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

  /**
   * 卸下
   * @param e
   * @returns
   */
  async deleteEquipment(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const thingName = e.msg.replace(/^(#|\/)?卸下/, '')
    // 得到数据
    const equipment = await GameApi.Equipment.get(UID)
    const islearned = equipment.find(item => item.name == thingName)
    if (!islearned) return
    const UserData = await GameApi.Users.read(UID)
    // 检查背包
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    // 删除
    await GameApi.Equipment.del(UID, thingName, islearned.id)
    // 收回装备
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: thingName,
        acount: 1
      }
    ])
    // 反馈
    setTimeout(async () => {
      const UserData = await GameApi.Users.read(UID)
      // 更新
      await GameApi.Equipment.updatePanel(UID, UserData.battle_blood_now)
      e.reply([`卸下[${thingName}]`], {
        quote: e.msg_id
      })
    }, 1500)
    return
  }
}
