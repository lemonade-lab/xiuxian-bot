import { plugin, type AEvent } from 'alemonjs'
import { DB, isThereAUserPresent, GameApi, sendReply } from '../../api/index.js'
export class Auction extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?虚空灯\d*$/, fnc: 'voidLamp' },
        {
          reg: /^(#|\/)?拍卖[\u4e00-\u9fa5]+\*\d+\*\d+$/,
          fnc: 'onAuctionThing'
        },
        { reg: /^(#|\/)?收回物品$/, fnc: 'retrieveItems' },
        { reg: /^(#|\/)?竞价\d+\*\d+$/, fnc: 'bidding' },
        { reg: /^(#|\/)?结算拍卖$/, fnc: 'sellingItems' },
        { reg: /^(#|\/)?拍走物品\d+$/, fnc: 'competition' }
      ]
    })
  }

  /**
   * 虚空灯
   * @param e
   * @returns
   */
  async voidLamp(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const p = e.msg.replace(/^(#|\/)?虚空灯/, '')
    const page = p == '' ? 1 : Number(p)
    const pageSize = GameApi.Cooling.pageSize
    const totalCount = await DB.auction.count()
    const totalPages = Math.ceil(totalCount / pageSize)
    if (page > totalPages) {
      return
    }
    const AuctionData: DB.AuctionType[] = (await DB.auction.findAll({
      attributes: ['id', 'name', 'account', 'price'],
      raw: true,
      limit: GameApi.Cooling.pageSize,
      offset: (page - 1) * GameApi.Cooling.pageSize
    })) as any
    const msg: string[] = []
    for await (const item of AuctionData) {
      msg.push(
        `\n🔸[${item?.id}]\n📦[${item?.name}]*${item?.account}\n💰${item?.price}`
      )
    }
    sendReply(e, `___[虚空灯]___(${page}/${totalPages})`, msg, 6)
    return
  }

  /**
   * 拍卖物品
   * @param e
   * @returns
   */
  async onAuctionThing(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    const [thingName, acount, money] = e.msg
      .replace(/^(#|\/)?拍卖/, '')
      .split('*')
    const bagThing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!bagThing) {
      e.reply([`没有[${thingName}]`], {
        quote: e.msg_id
      })
      return
    }
    if (bagThing.acount < Number(acount)) {
      e.reply([`[${thingName}]不够${acount}`], {
        quote: e.msg_id
      })
      return
    }
    if (Number(money) < 1000) {
      e.reply('价格不低于1000', {
        quote: e.msg_id
      })
      return
    }
    const AuctionThing = await GameApi.Auction.read(UserData.create_time)
    if (AuctionThing) {
      e.reply(['有待拍卖物品未处理'], {
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
    await GameApi.Auction.create({
      id: UserData.create_time, // 记的是时间挫
      state: 1, // 默认为 可拍卖 1
      start_time: new Date().getTime(),
      party_a: {
        id: UID,
        create_time: UserData.create_time
      },
      party_b: {
        id: 0,
        create_time: 0
      },
      party_all: {},
      name: thingName,
      account: Number(acount),
      price: Number(money),
      doc: null
    })
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
        `成功发布:\n${thingName}*${acount}*${money}\n编号:${UserData.create_time}`
      ],
      {
        quote: e.msg_id
      }
    )
    return
  }

  /**
   * 收回物品
   * @param e
   * @returns
   */
  async retrieveItems(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)

    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    // 还要再加一个寿命信息,拿到创建的时间
    const AuctionThing = await GameApi.Auction.read(UserData.create_time)
    // 每个人的创建时间都不同,可以作为第二个UID
    if (!AuctionThing) {
      e.reply(['未有正在拍卖的物品'], {
        quote: e.msg_id
      })
      return
    }
    //
    if (AuctionThing.party_b.id != '0') {
      e.reply(['的物品\n在竞价中,无法收回'], {
        quote: e.msg_id
      })
      return
    }
    // 删除物品
    await GameApi.Auction.del(UserData.create_time)
    // 添加
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: AuctionThing.name,
        acount: AuctionThing.account
      }
    ])
    e.reply([`成功收回竞拍物品`], {
      quote: e.msg_id
    })
    return
  }

  /**
   * 竞价
   * @param e
   * @returns
   */
  async bidding(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)

    // 寻找id
    const [ID, size] = e.msg.replace(/^(#|\/)?竞价/, '').split('*')
    const AuctionThing = await GameApi.Auction.read(Number(ID))
    if (!AuctionThing) {
      e.reply([`找不到${ID}`], {
        quote: e.msg_id
      })
      return
    }
    // 价格控制
    if (Number(size) < AuctionThing.price + 100) {
      e.reply(['需要价高100才可加价'], {
        quote: e.msg_id
      })
      return
    }

    const party_all = AuctionThing.party_all
    // 没记录
    if (!party_all[UserData.create_time]) {
      // 初始化记录
      party_all[UserData.create_time] = {
        uid: UID,
        price: 0
      }
    }
    // 价格差计算
    const number = Number(size) - party_all[UserData.create_time].price
    // 查看储物袋
    const lingshi = await GameApi.Bag.searchBagByName(UID, '下品灵石')
    // 灵石不够
    if (!lingshi || lingshi.acount < number) {
      e.reply([`似乎没有[下品灵石]*${number}`], {
        quote: e.msg_id
      })
      return
    }
    // 扣除灵石
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: number
      }
    ])
    e.reply([`对竞品${ID}\n出价[下品灵石]${size}`], {
      quote: e.msg_id
    })
    // 记录灵石
    party_all[UserData.create_time].price += number
    // 更新
    await GameApi.Auction.update(Number(ID), {
      start_time: new Date().getTime(),
      price: party_all[UserData.create_time].price,
      party_all,
      party_b: {
        id: UID,
        create_time: UserData.create_time
      }
    })
    return
  }

  /**
   * 结算拍卖
   * @param e
   * @returns
   */
  async sellingItems(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)

    // 自己储物袋满了
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }
    // 还要再加一个寿命信息,拿到创建的时间
    const AuctionThing = await GameApi.Auction.read(UserData.create_time)
    // 每个人的创建时间都不同,可以作为第二个UID
    if (!AuctionThing) {
      e.reply(['未有正在拍卖的物品'], {
        quote: e.msg_id
      })
      return
    }
    // 没有出价,不记录
    if (AuctionThing.party_b.id == '0') {
      e.reply(['的物品\n无人竞价'], {
        quote: e.msg_id
      })
      return
    }
    // 拍卖成功,给对方b加物品
    const UserDataB = await GameApi.Users.read(AuctionThing.party_b.id)
    // 时间匹配
    if (UserDataB.create_time == AuctionThing.party_b.create_time) {
      const BagSize = await GameApi.Bag.backpackFull(
        AuctionThing.party_b.id,
        UserDataB.bag_grade
      )
      // 背包未位置了直接返回了
      if (!BagSize) {
        e.reply('对方储物袋已满', {
          quote: e.msg_id
        })
        return
      }
      await GameApi.Bag.addBagThing(
        AuctionThing.party_b.id,
        UserDataB.bag_grade,
        [
          {
            name: AuctionThing.name,
            acount: AuctionThing.account
          }
        ]
      )
    }

    // 拍卖成功,自己拿走灵石
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: '下品灵石',
        acount: AuctionThing.price
      }
    ])
    e.reply(['成功竞拍物品'], {
      quote: e.msg_id
    })

    // 更新商城
    await GameApi.Auction.del(UserData.create_time)

    // 把前还回去
    const ListData = AuctionThing.party_all

    // 清除购买者记录
    delete ListData[AuctionThing.party_b.create_time]

    for (const item in ListData) {
      // item 是创建时间
      const UserDataS = await GameApi.Users.read(ListData[item].uid)
      // 时间匹配
      if (UserDataS.create_time == Number(item)) {
        await GameApi.Bag.addBagThing(ListData[item].uid, UserDataS.bag_grade, [
          {
            name: '下品灵石',
            acount: ListData[item].price
          }
        ])
      }
    }

    return
  }

  /**
   * 拍走物品
   * 谁都可以帮忙结算该行为?
   * 或者只能他自己结算
   * @param e
   * @returns
   */
  async competition(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    // 寻找id
    const ID = e.msg.replace(/^(#|\/)?拍走物品/, '')
    const AuctionThing = await GameApi.Auction.read(Number(ID))
    if (!AuctionThing) {
      e.reply([`找不到${ID}`])

      return
    }
    if (AuctionThing.party_b.id == '0') {
      e.reply(['未出价'])

      return
    }
    if (
      // 是不自己的
      AuctionThing.party_b.id != UID ||
      // 时间不对了
      AuctionThing.party_b.create_time != UserData.create_time
    ) {
      e.reply(['无权结算该物品'])

      return
    }
    // 开始时间 + 设定时间  = 最终结算时间
    const end_time = AuctionThing.start_time + 600000
    const now_time = new Date().getTime()
    if (end_time > new Date().getTime()) {
      // 未到结束时间
      e.reply([
        `物品冷却:${GameApi.Method.convertTime(end_time - now_time)}\n`,

        `可联系竞拍物主结算~`
      ])

      return
    }
    // 自己的储物袋满了
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'])

      return
    }
    // 物主的信息
    const UserDataB = await GameApi.Users.read(AuctionThing.party_a.id)
    // 看看物主在不在
    if (UserDataB.create_time == AuctionThing.party_a.create_time) {
      const BagSize = await GameApi.Bag.backpackFull(
        AuctionThing.party_a.id,
        UserDataB.bag_grade
      )
      // 背包未位置了直接返回了
      if (!BagSize) {
        e.reply('物主储物袋已满')

        return
      }
      // 是本人,还回去
      await GameApi.Bag.addBagThing(
        AuctionThing.party_a.id, // 给a灵石
        UserDataB.bag_grade,
        [
          {
            name: '下品灵石',
            acount: AuctionThing.price
          }
        ]
      )
    }
    // 自己拿走物品
    await GameApi.Bag.addBagThing(
      AuctionThing.party_b.id, // b拿走
      UserData.bag_grade,
      [
        {
          name: AuctionThing.name,
          acount: AuctionThing.account
        }
      ]
    )
    e.reply([`成功拍走了物品~`])

    // 删除记录
    await GameApi.Auction.del(Number(ID))

    // 把前还回去,除了那个aid
    const ListData = AuctionThing.party_all
    // 清除购买者记录
    delete ListData[AuctionThing.party_b.create_time]
    //
    for (const item in ListData) {
      // item 是创建时间
      const UserDataS = await GameApi.Users.read(ListData[item].uid)
      // 时间匹配
      if (UserDataS.create_time == Number(item)) {
        await GameApi.Bag.addBagThing(ListData[item].uid, UserDataS.bag_grade, [
          {
            name: '下品灵石',
            acount: ListData[item].price
          }
        ])
      }
    }
    return
  }
}
