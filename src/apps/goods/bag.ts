import { APlugin, type AEvent } from 'alemonjs'
import { GameApi, isThereAUserPresent, Server } from 'xiuxian-api'
import ImageComponent from 'xiuxian-component'

import * as DB from 'xiuxian-db'
export class Bag extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?(储物袋|儲物袋|背包)(武器|护具|法宝|丹药|功法|道具|材料|装备)?$/,
          fnc: 'showBagType'
        },
        { reg: /^(#|\/)?(储物袋|儲物袋|背包)(升级|升級)$/, fnc: 'bagUp' },
        {
          reg: /^(#|\/)?(储物袋|儲物袋|背包)(丢弃|丟棄)[\u4e00-\u9fa5]+\*\d+$/,
          fnc: 'discard'
        }
      ]
    })
  }

  /**
   * 按类型显示储物袋
   * @param e
   * @returns
   */
  async showBagType(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const type = e.msg.replace(/^(#|\/)?(储物袋|儲物袋|背包)/, '')
    const img = await ImageComponent.bag(
      await Server.backpackInformation(
        e.user_id,
        e.user_avatar,
        GameApi.Goods.mapType[type] ?? GameApi.Goods.mapType['道具']
      ),
      UID
    )
    if (typeof img != 'boolean') e.reply(img)
    return
  }

  /**
   * 储物袋丢弃
   * @param e
   * @returns
   */
  async discard(e: AEvent) {
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

  /**
   * 储物袋升级
   * @param e
   * @returns
   */
  async bagUp(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    let grade = UserData.bag_grade
    const Price = GameApi.Cooling.Price[grade]
    if (!Price) {
      e.reply(['已是极品储物袋'], {
        quote: e.msg_id
      })
      return
    }
    const thing = await GameApi.Bag.searchBagByName(UID, '下品灵石')
    if (!thing || thing.acount < Price) {
      e.reply([`灵石不足\n需要准备[下品灵石]*${Price}`], {
        quote: e.msg_id
      })
      return
    }
    // 加1
    grade++

    // 更新用户
    await GameApi.Users.update(UID, {
      bag_grade: grade
    } as DB.UserType)

    // 扣灵石
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: Price
      }
    ])
    e.reply([`花了${Price}*[下品灵石]升级\n目前储物袋等级为${grade}`], {
      quote: e.msg_id
    })
    return
  }
}
