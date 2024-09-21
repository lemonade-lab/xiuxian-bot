import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
export default OnResponse(
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const T = await operationLock(e.UserId)
    if (!T) {
      e.reply('操作频繁')
      return
    }
    /**
     * lock end
     */

    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const [thingName, quantity] = e.msg
      .replace(/^(#|\/)?(储物袋|儲物袋|背包)(丢弃|丟棄)/, '')
      .split('*')
    const thing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!thing) {
      e.reply([`没[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: thing.name,
        acount: Number(quantity)
      }
    ])
    e.reply([`丢弃[${thingName}]*${Number(quantity)}`], {
      quote: e.msg_id
    })
    return
  },
  'message.create',
  /^(#|\/)?(储物袋|儲物袋|背包)(丢弃|丟棄)[\u4e00-\u9fa5]+\*\d+$/
)
