import { APlugin, type AEvent } from 'alemonjs'
import { DB, isThereAUserPresent, GameApi, sendReply } from '../../api/index.js'
export class Exchange extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?虚空(镜|鏡)\d*$/, fnc: 'supermarket' },
        { reg: /^(#|\/)?上架[\u4e00-\u9fa5]+\*\d+\*\d+$/, fnc: 'onsell' },
        { reg: /^(#|\/)?下架物品$/, fnc: 'Offsell' },
        { reg: /^(#|\/)?(选购|選購)\d+$/, fnc: 'purchase' }
      ]
    })
  }

  async supermarket(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const p = e.msg.replace(/^(#|\/)?虚空(镜|鏡)/, '')
    const page = p == '' ? 1 : Number(p)
    const pageSize = GameApi.Cooling.pageSize
    const totalCount = await DB.auction.count()
    const totalPages = Math.ceil(totalCount / pageSize)
    if (page > totalPages) {
      return
    }
    const exchange: DB.ExchangeType[] = (await DB.exchange.findAll({
      attributes: ['id', 'name', 'account', 'price'],
      raw: true,
      limit: GameApi.Cooling.pageSize,
      offset: (page - 1) * GameApi.Cooling.pageSize
    })) as any
    const msg: string[] = []
    for await (const item of exchange) {
      msg.push(
        `\n🔸[${item?.id}]\n📦[${item?.name}]*${item?.account}\n💰${item?.price}`
      )
    }
    sendReply(e, `___[虚空镜]___(${page}/${totalPages})`, msg, 6)
    return
  }

  async onsell(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    const [thingName, acount, money] = e.msg
      .replace(/^(#|\/)?上架/, '')
      .split('*')
    const bagThing = await GameApi.Bag.searchBagByName(UID, thingName)

    if (Number(money) < 1000) {
      e.reply(['价格不低于1000'], {
        quote: e.msg_id
      })

      return
    }
    if (bagThing && bagThing.grade >= 40) return e.reply('无法交易')
    if (!bagThing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })

      return
    }
    if (bagThing.acount < Number(acount)) {
      e.reply([`[${thingName}]不够`], {
        quote: e.msg_id
      })

      return
    }
    // 寻找
    const exchange = await GameApi.Exchange.read(UserData.create_time)
    if (exchange) {
      e.reply(['有待出售物品未成功出售'], {
        quote: e.msg_id
      })

      return
    }
    if (Number(money) > bagThing.price * 66 * Number(acount)) {
      e.reply(['错误价位'], {
        quote: e.msg_id
      })

      return
    }
    const lingshi = await GameApi.Bag.searchBagByName(UID, '下品灵石')
    const number = Math.floor(Number(money) * 0.05)
    // 灵石不够
    if (!lingshi || lingshi.acount < number) {
      e.reply([`\n需要扣除[下品灵石]*${number}`], {
        quote: e.msg_id
      })

      return
    } else {
      e.reply([`扣除[下品灵石]*${number}`], {
        quote: e.msg_id
      })
    }
    // 上架
    await GameApi.Exchange.create({
      id: UserData.create_time,
      state: 1,
      party_a: {
        id: UID,
        create_time: UserData.create_time
      },
      party_b: {
        id: 0,
        create_time: 0
      },
      name: thingName,
      account: Number(acount),
      price: Number(money),
      doc: null
    })
    // 减少物品
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: thingName,
        acount: Number(acount)
      },
      {
        name: '下品灵石',
        acount: number
      }
    ])
    e.reply(
      [
        `成功上架\n${thingName}*${acount}*${money}\n编号:${UserData.create_time}`
      ],
      {
        quote: e.msg_id
      }
    )

    return
  }

  async Offsell(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    const exchange = await GameApi.Exchange.read(UserData.create_time)
    // 每个人时间都不同,可以作为第二个UID
    if (!exchange) {
      e.reply(['未有上架物品'], {
        quote: e.msg_id
      })

      return
    }
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })

      return
    }
    await GameApi.Exchange.del(UserData.create_time)
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: exchange.name,
        acount: exchange.account
      }
    ])
    e.reply([`成功下架个人物品`], {
      quote: e.msg_id
    })

    return
  }

  async purchase(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)

    // 寻找id
    const ID = e.msg.replace(/^(#|\/)?(选购|選購)/, '')
    const exchange = await GameApi.Exchange.read(Number(ID))
    if (!exchange) {
      e.reply([`找不到${ID}`], {
        quote: e.msg_id
      })

      return
    }
    // 验证
    const lingshi = await GameApi.Bag.searchBagByName(UID, '下品灵石')
    if (!lingshi || lingshi.acount < exchange.price) {
      e.reply([`似乎没有${exchange.price}下品灵石`], {
        quote: e.msg_id
      })

      return
    }
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })

      return
    }

    const UserDataB = await GameApi.Users.read(exchange.party_a.id)
    const BagSizeB = await GameApi.Bag.backpackFull(
      exchange.party_a.id,
      UserDataB.bag_grade
    )
    if (!BagSizeB) {
      e.reply('对方储物袋已满', {
        quote: e.msg_id
      })

      return
    }
    // 清除记录
    await GameApi.Exchange.del(Number(ID))
    // 减钱
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: exchange.price
      }
    ])
    // 加物品
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: exchange.name,
        acount: exchange.account
      }
    ])
    // 加钱
    await GameApi.Bag.addBagThing(exchange.party_a.id, UserDataB.bag_grade, [
      {
        name: '下品灵石',
        acount: exchange.price
      }
    ])
    e.reply([`成功选购${ID}`], {
      quote: e.msg_id
    })
    return
  }
}
