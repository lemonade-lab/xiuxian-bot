import { Text, useParse, useSend } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { user, user_equipment } from 'xiuxian-db'
export default OnResponse(
  async e => {
    // lock start
    const T = await GameApi.operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }

    // lock end
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    // message
    const text = useParse(e.Megs, 'Text')
    const thingName = text.replace(/^(#|\/)?卸下/, '')
    // 得到数据
    const equipment = await user_equipment
      .findAll({ where: { uid: UID } })
      .then(res => res.map(item => item.dataValues))
    const islearned = equipment.find(item => item.name == thingName)
    if (!islearned) return

    // 检查背包
    const BagSize = await GameApi.Bag.backpackFull(UID)
    if (!BagSize) {
      Send(Text('储物袋空间不足'))
      return
    }

    // 删除
    await user_equipment.destroy({
      where: { uid: UID, name: thingName, id: islearned.id }
    })

    // 收回装备
    await GameApi.Bag.addBagThing(UID, [
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

      Send(Text(`卸下[${thingName}]`))
    }, 1500)
    return
  },
  'message.create',
  /^(#|\/)?卸下[\u4e00-\u9fa5]+$/
)
