import { APlugin, type AEvent } from 'alemonjs'
import { DB, GameApi, sendReply, isThereAUserPresent } from '../../api/index.js'
export class Palace extends APlugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)?浩瀚仙宫$/,
          fnc: 'showPalace'
        },
        {
          reg: /^(#|\/)?南天宫$/,
          fnc: 'nantian'
        },
        {
          reg: /^(#|\/)?东湖宫$/,
          fnc: 'donhu'
        },
        {
          reg: /^(#|\/)?使用(沉香|玉香)兑换[\u4e00-\u9fa5]+\*\d+$/,
          fnc: 'usePalace'
        },
        {
          reg: /^(#|\/)?祈福(沉香|玉香)\*\d+$/,
          fnc: 'blessings'
        }
      ]
    })
  }

  /**
   * 祈福
   * @param e
   */
  async blessings(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const [thingName, quantity] = e.msg.replace(/^(#|\/)?祈福/, '').split('*')
    const ifexist: DB.GoodsType = (await DB.goods.findOne({
      where: {
        name: thingName // 找到物品名
      },
      raw: true
    })) as any
    if (!ifexist) {
      e.reply(`无[${thingName}]`, {
        quote: e.msg_id
      })

      return
    }
    // 单位极品
    const lingshi = await GameApi.Bag.searchBagByName(UID, '极品灵石')
    const price = ifexist.price * Number(quantity)
    if (!lingshi || lingshi.acount < price) {
      e.reply([`似乎没有${price}*[极品灵石]`], {
        quote: e.msg_id
      })

      return
    }
    //
    const UserData = await GameApi.Users.read(UID)
    // 检查背包
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'])
      return
    }
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: '极品灵石',
        acount: price
      }
    ])
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: ifexist.name,
        acount: Number(quantity)
      }
    ])
    e.reply(`消耗了[极品灵石]*${price}祈福了[${thingName}]*${quantity},`, {
      quote: e.msg_id
    })
    return
  }

  /**
   * 使用
   * @param e
   * @returns
   */
  async usePalace(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const [thingName, thingAcount] = e.msg
      .replace(/^(#|\/)?使用(沉香|玉香)兑换/, '')
      .split('*')

    const UserData = await GameApi.Users.read(UID)
    const BagSize = await GameApi.Bag.backpackFull(UID, UserData.bag_grade)
    if (!BagSize) {
      e.reply(['储物袋空间不足'], {
        quote: e.msg_id
      })
      return
    }

    if (/玉香/.test(e.msg)) {
      const palace: DB.GoodsType = (await DB.goods.findOne({
        where: {
          palace: 1,
          name: thingName
        },
        raw: true
      })) as any

      if (!palace) {
        e.reply(`南天宫中没有${thingName}`)
        return
      }

      const number = palace.price * Number(thingAcount)

      const lingshi = await GameApi.Bag.searchBagByName(UID, '玉香')

      // 灵石不够
      if (!lingshi || lingshi.acount < number) {
        e.reply([`似乎没有[玉香]*${number}`], {
          quote: e.msg_id
        })
        return
      } else {
        e.reply([`使用[玉香]*${number}`], {
          quote: e.msg_id
        })
      }

      // 扣除
      await GameApi.Bag.reduceBagThing(UID, [
        {
          name: '玉香',
          acount: number
        }
      ])

      // 增加
      await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
        {
          name: palace.name,
          acount: Number(thingAcount)
        }
      ])
      e.reply(`获得[${thingName}]*${thingAcount}`)
      return
    }

    // 读取活动条件
    const at: DB.ActivityType = (await DB.activity.findOne({
      where: {
        name: '东湖宫'
      },
      raw: true
    })) as any

    // 现在的时间戳
    const time = new Date().getTime()

    // 不在时间之内
    if (time <= at.start_time || time >= at.end_time) {
      e.reply('东湖宫暂未显世~')
      return
    }

    const limit: DB.GoodsType = (await DB.goods.findOne({
      where: {
        limit: [1, 3],
        name: thingName
      },
      raw: true
    })) as any

    if (!limit) {
      e.reply(`南天宫中没有${thingName}`)
      return
    }

    const number = limit.price * Number(thingAcount)

    const lingshi = await GameApi.Bag.searchBagByName(UID, '沉香')

    if (!lingshi || lingshi.acount < number) {
      e.reply([`似乎没有[沉香]*${number}`], {
        quote: e.msg_id
      })
      return
    } else {
      e.reply([`使用[沉香]*${number}`], {
        quote: e.msg_id
      })
    }

    // 扣除
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: '沉香',
        acount: number
      }
    ])

    // 增加
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: limit.name,
        acount: Number(thingAcount)
      }
    ])

    e.reply(`获得[${thingName}]*${thingAcount}`)

    return
  }

  /**
   *
   * @param e
   * @returns
   */
  async donhu(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const start_msg = [
      '\n阿了:哈哈哈哈~你是在找我吗?',
      '\n阿了:好饿好饿,你好像有灵石哎'
    ]
    const limit = (await DB.goods.findAll({
      where: {
        limit: [1, 3]
      },
      raw: true
    })) as any
    const end_msg = GameApi.Goods.getListMsg(limit, '沉香')
    sendReply(e, '___[东湖宫]___', [...start_msg, ...end_msg])
    return
  }

  /**
   *
   * @param e
   */
  async nantian(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const start_msg = [
      '\n阿了:哈哈哈哈~你是在找我吗?',
      '\n阿了:好饿好饿,你好像有灵石哎'
    ]
    const palace = (await DB.goods.findAll({
      where: {
        palace: 1
      },
      raw: true
    })) as any
    const end_msg = GameApi.Goods.getListMsg(palace, '玉香')
    sendReply(e, '___[南天宫]___', [...start_msg, ...end_msg])
    return
  }

  /**
   * 浩瀚仙宫
   * @param e
   * @returns
   */
  async showPalace(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const start_msg = [
      '\n阿了:哈哈哈哈~你是在找我吗?',
      '\n阿了:好饿好饿,你好像有灵石哎'
    ]
    const palace = (await DB.goods.findAll({
      where: {
        palace: 1
      },
      raw: true
    })) as any
    const limit = (await DB.goods.findAll({
      where: {
        limit: [1, 3]
      },
      raw: true
    })) as any
    const limit_end_msg = GameApi.Goods.getListMsg(limit, '沉香')
    const palace_end_msg = GameApi.Goods.getListMsg(palace, '玉香')
    sendReply(e, '___[浩瀚宫殿]___', [
      ...start_msg,
      ...palace_end_msg,
      ...limit_end_msg
    ])
    return
  }
}
