import { APlugin, Controllers, type AEvent } from 'alemonjs'
import { controlByName, sendReply, isThereAUserPresent } from 'xiuxian-api'

import { Method } from 'xiuxian-core'

import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'

export class Transaction extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?(万宝楼|萬寶樓)(武器|护具|法宝|丹药|功法|道具|材料|装备)?$/,
          fnc: 'showComodities'
        },
        {
          reg: /^(#|\/)?(购买|購買)[\u4e00-\u9fa5]+\*\d+$/,
          fnc: 'buyComodities'
        },
        { reg: /^(#|\/)?出售[\u4e00-\u9fa5]+\*\d+$/, fnc: 'sellComodities' },
        {
          reg: /^(#|\/)?售出所有(武器|护具|法宝|丹药|功法|道具|材料|装备)$/,
          fnc: 'shellAllType'
        },
        {
          reg: /^(#|\/)?售出所有物品$/,
          fnc: 'shellAllGoods'
        }
      ]
    })
  }

  /**
   *万宝楼
   * @param e
   * @returns
   */
  async showComodities(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '万宝楼'))) return
    const start_msg = []
    start_msg.push('\n欢迎关顾本店')
    const type = e.msg.replace(/^(#|\/)?(万宝楼|萬寶樓)/, '')
    const commoditiesList = await DB.goods
      .findAll({
        where: {
          commodities: 1,
          type: GameApi.Goods.mapType[type] ?? GameApi.Goods.mapType['道具']
        }
      })
      .then(res => res.map(item => item.dataValues))
    const end_msg = GameApi.Goods.getListMsg(
      commoditiesList,
      '灵石',
      GameApi.Cooling.ExchangeStart
    )
    sendReply(e, '___[万宝楼]___', [...start_msg, ...end_msg])
    Controllers(e).Message.reply('', [
      { label: '购买', value: '/购买', enter: false },
      { label: '出售', value: '/出售', enter: false },
      { label: '售出所有', value: '/售出所有材料', enter: false }
    ])
    return
  }

  /**
   *出售
   * @param e
   * @returns
   */
  async sellComodities(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '万宝楼'))) return
    const [thingName, quantity] = e.msg.replace(/^(#|\/)?出售/, '').split('*')
    // 检查物品
    const thing = await GameApi.Bag.searchBagByName(UID, thingName)
    if (!thing) {
      e.reply(`没[${thingName}]`, {
        quote: e.msg_id
      })

      return
    }
    // 检查数量
    if (thing.acount < Number(quantity)) {
      e.reply('数量不足', {
        quote: e.msg_id
      })

      return
    }
    // 先把物品去除,去除后必然空出一个背包位置
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: thing.name,
        acount: Number(quantity)
      }
    ])
    // 计算所得
    const commoditiesPrice = Math.floor(
      thing.price * Number(quantity) * GameApi.Cooling.ExchangeEnd
    )

    // 添加物品
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: '下品灵石',
        acount: commoditiesPrice
      }
    ])

    e.reply(`[万宝楼]欧阳峰:\n出售得${commoditiesPrice}*[下品灵石]`)

    return
  }

  /**
   * 购买
   * @param e
   * @returns
   */
  async buyComodities(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '万宝楼'))) return
    const [thingName, quantity] = e.msg
      .replace(/^(#|\/)?(购买|購買)/, '')
      .split('*')
    const ifexist = await DB.goods
      .findOne({
        where: {
          commodities: 1, // 找到万宝楼可购买的物品
          name: thingName // 找到物品名
        }
      })
      .then(res => res?.dataValues)
    if (!ifexist) {
      e.reply(`[万宝楼]小二:\n不卖[${thingName}]`)
      return
    }
    const lingshi = await GameApi.Bag.searchBagByName(UID, '下品灵石')
    const count = Math.floor(Number(quantity))

    const price = Math.floor(
      ifexist.price * count * GameApi.Cooling.ExchangeStart
    )
    if (!lingshi || lingshi.acount < price) {
      e.reply([`似乎没有${price}*[下品灵石]`], {
        quote: e.msg_id
      })
      return
    }
    // 检查背包
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }

    // 查看自己可买多少
    const bData = await DB.user_buy_log
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res?.dataValues)
    const now = new Date()

    if (count > ifexist.limit_buy) {
      e.reply(`[万宝楼]小二:\n每天可买${ifexist.limit_buy}`)
      return
    }

    if (bData) {
      // 存在  判断日期
      if (
        Method.isSameDay(bData.buy_time, now) &&
        bData.count > ifexist.limit_buy
      ) {
        e.reply(`[万宝楼]小二:\n每天可买${ifexist.limit_buy - bData.count}`)
        return
      } else {
        // 更新数据
        await DB.user_buy_log.update(
          {
            count: bData.count + count,
            buy_time: now,
            createAt: now
          },
          {
            where: {
              uid: UID,
              name: thingName
            }
          }
        )
      }
    } else {
      // 不存在，创建即可
      await DB.user_buy_log.create({
        uid: UID,
        name: thingName,
        count: count,
        buy_time: now,
        createAt: now
      })
    }

    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: price
      }
    ])

    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: ifexist.name,
        acount: count
      }
    ])

    e.reply(
      `[万宝楼]薛仁贵\n你花[下品灵石]*${price}购买了[${thingName}]*${count},`
    )

    return
  }

  /**
   * 售出所有
   * @param e
   * @returns
   */
  async shellAllType(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '万宝楼'))) return
    const type = e.msg.replace(/^(#|\/)?售出所有/, '')

    // 金额累计
    let money = 0

    if (!Object.prototype.hasOwnProperty.call(GameApi.Goods.mapType, type)) {
      e.reply('错误类型', {
        quote: e.msg_id
      })

      return
    }

    // 得到该物品的所有信息
    const bag = await DB.user_bag
      .findAll({
        where: {
          uid: UID
        },
        include: {
          model: DB.goods,
          where: {
            type: GameApi.Goods.mapType[type]
          }
        }
      })
      .then(res => res.map(item => item.dataValues))

    // 计算金额
    for await (const item of bag) {
      money += item.acount * item['good']['dataValues']['price']
    }

    // 计算所得
    money = Math.floor(money * GameApi.Cooling.ExchangeEnd)

    // 出现错误
    if (isNaN(money) || money == 0) {
      e.reply('[蜀山派]叶铭\n一边去')

      return
    }

    // 直接清除一个类型,必然会空出位置
    await GameApi.Bag.del(UID, [GameApi.Goods.mapType[type]])

    // 增加下品灵石
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      { name: '下品灵石', acount: money }
    ])

    // 反馈
    e.reply(`[蜀山派]叶铭\n这是${money}*[下品灵石],道友慢走`)

    return
  }

  /**
   * 售出所有 物品
   * @param e
   * @returns
   */
  async shellAllGoods(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '万宝楼'))) return
    // 累计
    let money = 0
    // 得到该物品的所有信息
    const bag = await DB.user_bag
      .findAll({
        where: {
          uid: UID
        },
        include: {
          model: DB.goods
        }
      })
      .then(res => res.map(item => item.dataValues))
    // 计算金额
    for await (const item of bag) {
      money += item.acount * item['good']['dataValues']['price']
    }

    // 计算所得
    money = Math.floor(money * GameApi.Cooling.ExchangeEnd)

    // 出现错误
    if (isNaN(money) || money == 0) {
      e.reply('[蜀山派]叶铭\n一边去')
      return
    }

    // 删除所有
    await GameApi.Bag.del(UID)

    // 获得
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: '下品灵石',
        acount: money
      }
    ])

    // 发送
    e.reply(`[蜀山派]叶铭\n这是${money}*[下品灵石],道友慢走`)

    return
  }
}
