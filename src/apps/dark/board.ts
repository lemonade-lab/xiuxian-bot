import { APlugin, Controllers, type AEvent } from 'alemonjs'
import { DB, isThereAUserPresent, GameApi, sendReply } from '../../api/index.js'
export class Board extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?虚空板\d*$/, fnc: 'coidBoard' },
        {
          reg: /^(#|\/)?收购[\u4e00-\u9fa5]+\*\d+\*\d+$/,
          fnc: 'onsacquisitionell'
        },
        { reg: /^(#|\/)?收回留言$/, fnc: 'recallMessage' },
        { reg: /^(#|\/)?交付\d+$/, fnc: 'deliver' }
      ]
    })
  }

  /**
   *虚空板
   * @param e
   * @returns
   */
  async coidBoard(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const p = e.msg.replace(/^(#|\/)?虚空板/, '')
    const page = p == '' ? 1 : Number(p)
    const pageSize = GameApi.Cooling.pageSize
    const totalCount = await DB.auction.count()
    const totalPages = Math.ceil(totalCount / pageSize)
    if (page > totalPages) {
      return
    }
    const BoardData: DB.BoardType[] = (await DB.board.findAll({
      attributes: ['id', 'name', 'account', 'price'],
      raw: true,
      limit: GameApi.Cooling.pageSize,
      offset: (page - 1) * GameApi.Cooling.pageSize
    })) as any
    const msg: string[] = []
    for await (const item of BoardData) {
      msg.push(
        `\n🔸[${item?.id}]\n📦[${item?.name}]*${item?.account}\n💰${item?.price}`
      )
    }
    sendReply(e, `___[虚空板]___(${page}/${totalPages})`, msg, 6)

    Controllers(e).Message.reply('', [
      {
        label: '收回留言',
        value: '/收回留言'
      },
      {
        label: '收购',
        value: '/收购',
        enter: false
      },
      {
        label: '交付',
        value: '/交付',
        enter: false
      }
    ])

    return
  }

  /**
   * 收购
   * @param e
   * @returns
   */
  async onsacquisitionell(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    const [thingName, acount, money] = e.msg
      .replace(/^(#|\/)?收购/, '')
      .split('*')
    if (
      (
        (await DB.goods.findOne({
          where: { name: thingName },
          raw: true
        })) as any
      ).grade >= 40
    )
      return e.reply('无法交易')
    if (Number(money) < 1000) {
      e.reply(['价格不低于1000'], {
        quote: e.msg_id
      })

      return
    }
    // 寻找
    const Board = await GameApi.Board.read(UserData.create_time)
    if (Board) {
      e.reply(['有待处理留言'], {
        quote: e.msg_id
      })

      return
    }
    const search = await GameApi.Goods.searchAllThing(thingName)
    if (!search) {
      e.reply([`此方世界没有 ${thingName}`], {
        quote: e.msg_id
      })

      return
    }
    // 看看有没有这么多钱
    const lingshi = await GameApi.Bag.searchBagByName(UID, '下品灵石')
    if (!lingshi || lingshi.acount < Number(money)) {
      e.reply([`似乎没有[下品灵石]*${money}`], {
        quote: e.msg_id
      })

      return
    }

    // 扣钱
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: Number(money)
      }
    ])

    // 留言
    await GameApi.Board.create({
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
    e.reply(
      [
        `成功留言\n${thingName}*${acount}*${money}\n编号:${UserData.create_time}`
      ],
      {
        quote: e.msg_id
      }
    )

    return
  }

  /**
   * 收回留言
   * @param e
   * @returns
   */
  async recallMessage(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)

    const Board = await GameApi.Board.read(UserData.create_time)
    // 每个人时间都不同,可以作为第二个UID
    if (!Board) {
      e.reply(['未有留言'], {
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

    // 删除留言
    await GameApi.Board.del(UserData.create_time)

    // 把钱拿回来
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: '下品灵石',
        acount: Board.price
      }
    ])

    e.reply(['已收回留言'], {
      quote: e.msg_id
    })

    return
  }

  /**
   * 交付
   * @param e
   * @returns
   */
  async deliver(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    // 寻找id
    const ID = e.msg.replace(/^(#|\/)?交付/, '')
    const Board = await GameApi.Board.read(Number(ID))
    if (!Board) {
      e.reply([`${ID}非留言记录`], {
        quote: e.msg_id
      })

      return
    }
    // 验证有没有这个物品
    const lingshi = await GameApi.Bag.searchBagByName(UID, Board.name)
    if (!lingshi || lingshi.acount < Board.account) {
      e.reply([`似乎没有[${Board.name}]*${Board.account}`], {
        quote: e.msg_id
      })
      return
    }
    const UserData = await GameApi.Users.read(UID)
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    // 背包未位置了直接返回了
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })

      return
    }
    const UserDataB = await GameApi.Users.read(Board.party_a.id)
    const BagSizeB = await GameApi.Bag.backpackFull(
      Board.party_a.id,
      UserDataB.bag_grade
    )
    if (!BagSizeB) {
      e.reply('对方储物袋空间不足', {
        quote: e.msg_id
      })

      return
    }
    // 清除记录
    await GameApi.Board.del(Number(ID))
    // 交付物品
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: Board.name,
        acount: Board.account
      }
    ])
    // 收到钱
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: '下品灵石',
        acount: Board.price
      }
    ])

    // 对方收到物品
    await GameApi.Bag.addBagThing(Board.party_a.id, UserDataB.bag_grade, [
      {
        name: Board.name,
        acount: Board.account
      }
    ])

    e.reply([`成功交付${ID}`], {
      quote: e.msg_id
    })

    return
  }
}
