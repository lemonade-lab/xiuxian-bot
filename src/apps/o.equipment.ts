import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { Redis, user, user_equipment } from 'xiuxian-db'
export default new Messages().response(
  /^(#|\/)?卸下[\u4e00-\u9fa5]+$/,
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
    const thingName = e.msg.replace(/^(#|\/)?卸下/, '')
    // 得到数据
    const equipment = await user_equipment
      .findAll({ where: { uid: UID } })
      .then(res => res.map(item => item.dataValues))

    const islearned = equipment.find(item => item.name == thingName)

    if (!islearned) return
    const UserData = await user
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res.dataValues)
    // 检查背包
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }

    // 删除
    await user_equipment.destroy({
      where: { uid: UID, name: thingName, id: islearned.id }
    })

    // 收回装备
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: thingName,
        acount: 1
      }
    ])

    // 反馈
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
      e.reply([`卸下[${thingName}]`], {
        quote: e.msg_id
      })
    }, 1500)
    return
  }
)
