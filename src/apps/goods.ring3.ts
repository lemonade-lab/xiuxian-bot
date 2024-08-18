import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { Redis } from 'xiuxian-db'
export default new Messages().response(
  /^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))存入[\u4e00-\u9fa5]+\*\d+$/,
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
  }
)
