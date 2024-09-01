import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?仙石兑换.*$/, async e => {
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

  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return

  //检查是不是在时间内
  if (
    !(
      Date.now() >= new Date('2024-04-08').getTime() &&
      Date.now() <= new Date('2024-04-11').getTime()
    )
  ) {
    e.reply('未开放')
    return
  }
  const thingName = e.msg.replace(/^(#|\/)?仙石兑换/, '')
  // 检查背包
  const BagSize = await GameApi.Bag.backpackFull(UID)
  // 背包未位置了直接返回了
  if (!BagSize) {
    e.reply(['储物袋空间不足'], {
      quote: e.msg_id
    })
  }
  if (thingName == '天道剑') {
    const bag = await GameApi.Bag.searchBagByName(UID, '仙石')
    if (!bag || bag.acount < 4) {
      e.reply('仙石不足')
      return
    }
    const bagdata = await GameApi.Bag.searchBagByName(UID, '沉香')
    if (!bagdata || bagdata.acount < 50) {
      e.reply('沉香不足')
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
      e.reply('仙石不足')
      return
    }
    const bagdata = await GameApi.Bag.searchBagByName(UID, '沉香')
    if (!bagdata || bagdata.acount < 40) {
      e.reply('沉香不足')
      return
    }
    GameApi.Bag.reduceBagThing(UID, [
      { name: '仙石', acount: 4 },
      { name: '沉香', acount: 40 }
    ])
    GameApi.Bag.addBagThing(UID, [{ name: '天罡神盾袍', acount: 1 }])
  } else {
    e.reply(`哪来的${thingName}`)
  }
  return
})
