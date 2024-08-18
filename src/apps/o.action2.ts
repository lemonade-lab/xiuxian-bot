import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?(学习|學習)[\u4e00-\u9fa5]+$/,
  async e => {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const thingName = e.msg.replace(/^(#|\/)?(学习|學習)/, '')
    const thing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!thing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }

    const AllSorcery = await GameApi.Skills.get(UID)

    const islearned = AllSorcery.find(item => item.name == thing.name)
    if (islearned) {
      e.reply(['学过了'], {
        quote: e.msg_id
      })
      return
    }

    if (AllSorcery.length >= GameApi.Cooling.myconfig_gongfa) {
      e.reply(['反复看了又看\n却怎么也学不进'], {
        quote: e.msg_id
      })
      return
    }

    /**
     * 新增功法
     */
    await GameApi.Skills.add(UID, thing.name)
    // 更新天赋
    setTimeout(async () => {
      const UserData = await GameApi.Users.read(UID)
      await GameApi.Skills.updataEfficiency(UID, UserData.talent)
    }, 1000)
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: thing.name,
        acount: 1
      }
    ])
    e.reply([`学习[${thingName}]`], {
      quote: e.msg_id
    })
    return
  }
)
