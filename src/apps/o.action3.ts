import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?忘掉[\u4e00-\u9fa5]+$/,
  async e => {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return

    const thingName = e.msg.replace(/^(#|\/)?忘掉/, '')
    const AllSorcery = await GameApi.Skills.get(UID)
    const islearned = AllSorcery.find(item => item.name == thingName)
    if (!islearned) {
      e.reply([`没学过[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }

    const UserData = await GameApi.Users.read(UID)
    /**
     * 检查背包
     */
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }

    // 直接删

    await GameApi.Skills.del(UID, thingName)

    /**
     * 更新天赋
     */
    setTimeout(async () => {
      const UserData = await GameApi.Users.read(UID)
      await GameApi.Skills.updataEfficiency(UID, UserData.talent)
    }, 500)

    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      { name: islearned.name, acount: 1 }
    ])

    e.reply([`忘了[${thingName}]`], {
      quote: e.msg_id
    })
    return
  }
)
