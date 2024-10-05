import { Text, useParse, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
import * as GameApi from '@xiuxian/core/index'
export default OnResponse(
  async e => {
    // lock start
    const T = await GameApi.operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }

    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const text = useParse(e.Megs, 'Text')

    const [thingName, thingAcount] = text
      .replace(/^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))存入/, '')
      .split('*')

    // 检查储物袋
    const thing = await GameApi.Bag.searchBagByName(UID, thingName)

    if (!thing) {
      Send(Text(`没有[${thingName}]`))

      return
    }
    if (thing.acount < Number(thingAcount)) {
      Send(Text('数量不足'))

      return
    }

    // 检查戒指有没有这个物品
    const RingThing = await GameApi.Ring.searchRingByName(UID, thingName)
    // 检查戒指空间
    const RingSize = await GameApi.Ring.backpackFull(UID)
    // 戒指满位置了直接返回了
    if (!RingThing && !RingSize) {
      Send(Text('戒指空间不足'))

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

    Send(Text('存入成功' + thingName))

    return
  },
  'message.create',
  /^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))存入[\u4e00-\u9fa5]+\*\d+$/
)
