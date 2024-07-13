import { APlugin, Controllers, type AEvent } from 'alemonjs'
import {
  GameApi,
  controlByName,
  sendReply,
  isThereAUserPresent
} from '../../api/index.js'

import * as DB from 'xiuxian-db'

export class union extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?(联盟商会|聯盟商會)(武器|护具|法宝|丹药|功法|道具|材料|装备)?$/,
          fnc: 'unionShop'
        },
        { reg: /^(#|\/)?(贡献|貢獻)[\u4e00-\u9fa5]+\*\d+$/, fnc: 'contribute' },
        { reg: /^(#|\/)?(兑换|兌換)[\u4e00-\u9fa5]+\*\d+$/, fnc: 'unionBuy' },
        { reg: /^(#|\/)?仙石兑换.*$/, fnc: 'exchange' }
      ]
    })
  }

  /**
   *
   * @param e
   * @returns
   */
  async unionShop(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '联盟'))) return
    const start_msg = []
    start_msg.push('\n[/兑换+物品名*数量]')
    const type = e.msg.replace(/^(#|\/)?(联盟商会|聯盟商會)/, '')
    const commoditiesList: DB.GoodsType[] = (await DB.goods.findAll({
      where: {
        alliancemall: 1,
        type: GameApi.Goods.mapType[type] ?? GameApi.Goods.mapType['道具']
      },
      raw: true
    })) as any
    const end_msg = GameApi.Goods.getListMsg(commoditiesList, '声望')
    const msg = [...start_msg, ...end_msg]
    sendReply(e, '___[联盟商会]___', msg)

    Controllers(e).Message.reply('', [
      { label: '贡献', value: '/贡献', enter: false },
      { label: '兑换', value: '/兑换', enter: false }
    ])

    return
  }

  /**
   *
   * @param e
   * @returns
   */
  async unionBuy(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '联盟'))) return
    const [thingName, quantity] = e.msg
      .replace(/^(#|\/)?(兑换|兌換)/, '')
      .split('*')
    const ifexist: DB.GoodsType = (await DB.goods.findOne({
      where: {
        alliancemall: 1,
        name: thingName
      },
      raw: true
    })) as any
    if (!ifexist) {
      e.reply(`[联盟]叶铭\n没有[${thingName}]`)
      return
    }
    const price = Math.floor(ifexist.price * Number(quantity))
    if (UserData.special_reputation < price) {
      e.reply(`[联盟]叶铭\n你似乎没有${price}*[声望]`)

      return
    }
    // 检查背包
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })

      return
    }
    UserData.special_reputation -= price
    // 更新用户
    await GameApi.Users.update(UID, {
      special_reputation: UserData.special_reputation
    } as DB.UserType)
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: ifexist.name,
        acount: Number(quantity)
      }
    ])
    e.reply(`[联盟]叶铭\n使用[声望]*${price}兑换了[${thingName}]*${quantity},`)
    return
  }

  /**
   *贡献
   * @param e
   * @returns
   */
  async contribute(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '联盟'))) return
    const [thingName, quantity] = e.msg
      .replace(/^(#|\/)?(贡献|貢獻)/, '')
      .split('*')
    const thing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!thing) {
      e.reply(`[联盟]黄天霸\n你没[${thingName}]`)

      return
    }
    if (thing.acount < Number(quantity)) {
      e.reply('[联盟]黄天霸\n数量不足')

      return
    }
    if (thing.price * Number(quantity) < 2000) {
      e.reply('[联盟]黄天霸\n物品价值不足2000')
      return
    }
    // 减少
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: thing.name,
        acount: Number(quantity)
      }
    ])
    const size = Math.floor((thing.price * Number(quantity)) / 66)
    // 更新用户
    GameApi.Users.update(UID, {
      special_reputation: UserData.special_reputation + size
    } as DB.UserType)
    e.reply(`[联盟]黄天霸\n贡献成功,奖励[声望]*${size}`)

    return
  }

  /**
   * 兑换天道剑
   * @param e
   * @returns
   */
  async exchange(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    //检查是不是在时间内
    if (
      !(
        Date.now() >= new Date('2024-04-08').getTime() &&
        Date.now() <= new Date('2024-04-11').getTime()
      )
    ) {
      return e.reply('未开放')
    }
    const UserData = await GameApi.Users.read(UID)
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
        return e.reply('仙石不足')
      }
      const bagdata = await GameApi.Bag.searchBagByName(UID, '沉香')
      if (!bagdata || bagdata.acount < 50) {
        return e.reply('沉香不足')
      }
      GameApi.Bag.reduceBagThing(UID, [
        { name: '仙石', acount: 4 },
        { name: '沉香', acount: 50 }
      ])
      GameApi.Bag.addBagThing(UID, 99, [{ name: '天道剑', acount: 1 }])
    } else if (thingName == '天罡神盾袍') {
      const bag = await GameApi.Bag.searchBagByName(UID, '仙石')
      if (!bag || bag.acount < 4) {
        return e.reply('仙石不足')
      }
      const bagdata = await GameApi.Bag.searchBagByName(UID, '沉香')
      if (!bagdata || bagdata.acount < 40) {
        return e.reply('沉香不足')
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
  }
}
