import { Text, useParse, useSend } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default OnResponse(
  async e => {
    // lock start
    const T = await GameApi.operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }

    //检查用户
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    //检查是不是在时间内
    if (
      !(
        Date.now() >= new Date('2024-04-08').getTime() &&
        Date.now() <= new Date('2024-04-11').getTime()
      )
    ) {
      Send(Text('未开放'))
      return
    }

    //检查是不是在联盟
    const text = useParse(e.Megs, 'Text')
    const thingName = text.replace(/^(#|\/)?仙石兑换/, '')
    // 检查背包
    const BagSize = await GameApi.Bag.backpackFull(UID)
    // 背包未位置了直接返回了
    if (!BagSize) {
      Send(Text('储物袋空间不足'))
      return
    }
    if (thingName == '天道剑') {
      const bag = await GameApi.Bag.searchBagByName(UID, '仙石')
      if (!bag || bag.acount < 4) {
        Send(Text('仙石不足'))
        return
      }
      const bagdata = await GameApi.Bag.searchBagByName(UID, '沉香')
      if (!bagdata || bagdata.acount < 50) {
        Send(Text('沉香不足'))
        return
      }
      GameApi.Bag.reduceBagThing(UID, [
        { name: '仙石', acount: 4 },
        { name: '沉香', acount: 50 }
      ])
      GameApi.Bag.addBagThing(UID, [{ name: '天道剑', acount: 1 }])
    } else if (thingName == '天罡神盾袍') {
      const bag = await GameApi.Bag.searchBagByName(UID, '仙石')
      if (!bag || bag.acount < 4) {
        Send(Text('仙石不足'))
        return
      }
      const bagdata = await GameApi.Bag.searchBagByName(UID, '沉香')
      if (!bagdata || bagdata.acount < 40) {
        Send(Text('沉香不足'))
        return
      }
      GameApi.Bag.reduceBagThing(UID, [
        { name: '仙石', acount: 4 },
        { name: '沉香', acount: 40 }
      ])
      GameApi.Bag.addBagThing(UID, [{ name: '天罡神盾袍', acount: 1 }])
    } else {
      Send(Text(`哪来的${thingName}`))
    }
    return
  },
  'message.create',
  /^(#|\/)?仙石兑换.*$/
)
