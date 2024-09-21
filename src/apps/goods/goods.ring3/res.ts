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

    const [thingName, thingAcount] = e.msg
      .replace(/^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))存入/, '')
      .split('*')

    // 检查储物袋
    const thing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!thing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    if (thing.acount < Number(thingAcount)) {
      e.reply(['数量不足'], {
        quote: e.msg_id
      })
      return
    }

    // 检查戒指有没有这个物品
    const RingThing = await GameApi.Ring.searchRingByName(UID, thingName)
    // 检查戒指空间
    const RingSize = await GameApi.Ring.backpackFull(UID)
    // 戒指满位置了直接返回了
    if (!RingThing && !RingSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }

    // 储物袋减少
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: thingName,
        acount: Number(thingAcount)
      }
    ])

    // 戒指增加
    await GameApi.Ring.addRingThing(UID, [
      {
        name: thingName,
        acount: Number(thingAcount)
      }
    ])

    e.reply(['存入', thingName], {
      quote: e.msg_id
    })
    return
  },
  'message.create',
  /^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))存入[\u4e00-\u9fa5]+\*\d+$/
)
