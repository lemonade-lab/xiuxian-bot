import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?(储物袋|儲物袋|背包)(丢弃|丟棄)[\u4e00-\u9fa5]+\*\d+$/,
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const T = await operationLock(e.user_id)
    if (!T) {
      e.reply('操作频繁')
      return
    }
    /**
     * lock end
     */

    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
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
  }
)
