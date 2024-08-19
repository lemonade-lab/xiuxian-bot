import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { Redis, user } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?仙石兑换.*$/, async e => {
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
  const UserData = await user
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)
  const thingName = e.msg.replace(/^(#|\/)?仙石兑换/, '')
  // 检查背包
  const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
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
    GameApi.Bag.addBagThing(UID, 99, [{ name: '天道剑', acount: 1 }])
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
    GameApi.Bag.addBagThing(UID, 50, [{ name: '天罡神盾袍', acount: 1 }])
  } else {
    e.reply(`哪来的${thingName}`)
  }
  return
})
