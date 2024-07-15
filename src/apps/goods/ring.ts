import { APlugin, type AEvent } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'

import { picture } from 'xiuxian-component'

import * as GameApi from 'xiuxian-core'
import * as Server from 'xiuxian-statistics'
export class Ring extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))$/,
          fnc: 'showRing'
        },
        {
          reg: /^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))取出[\u4e00-\u9fa5]+\*\d+$/,
          fnc: 'takeOut'
        },
        {
          reg: /^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))存入[\u4e00-\u9fa5]+\*\d+$/,
          fnc: 'deposit'
        }
      ]
    })
  }

  /**
   * 纳|呐|那)(借|介|戒
   * @param e
   * @returns
   */
  async showRing(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const data = await Server.ringInformation(UID, e.user_avatar)
    const img = await picture.render('RingComponent', {
      cssName: 'new-ring',
      props: {
        data
      },
      name: UID
    })
    if (typeof img != 'boolean') e.reply(img)
    return
  }

  /**
   * 取出
   * @param e
   * @returns
   */
  async takeOut(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const [thingName, thingAcount] = e.msg
      .replace(/^(#|\/)?(戒指|(纳|呐|那)(借|介|戒))取出/, '')
      .split('*')
    // 检查戒指
    const thing = await GameApi.Ring.searchRingByName(UID, thingName)
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
    // 检查储物袋空间
    const UserData = await GameApi.Users.read(UID)
    // 检查储物袋有没有这个物品
    const BagThing = await GameApi.Bag.searchBagByName(UID, thingName)
    // 检查储物袋空间
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包满位置了直接返回了
    if (!BagThing && !BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }

    // 储物袋增加
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: thingName,
        acount: Number(thingAcount)
      }
    ])

    // 戒指减少
    await GameApi.Ring.reduceRingThing(UID, [
      {
        name: thingName,
        acount: Number(thingAcount)
      }
    ])
    e.reply(['取出', thingName], {
      quote: e.msg_id
    })
    return
  }

  /**
   * 存入
   * @param e
   * @returns
   */
  async deposit(e: AEvent) {
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

    // 戒指增加
    await GameApi.Ring.addRingThing(UID, [
      {
        name: thingName,
        acount: Number(thingAcount)
      }
    ])

    // 储物袋减少
    await GameApi.Bag.reduceBagThing(UID, [
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
}
