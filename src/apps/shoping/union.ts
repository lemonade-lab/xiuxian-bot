import { APlugin, type AEvent } from 'alemonjs'
import {
  DB,
  GameApi,
  controlByName,
  sendReply,
  isThereAUserPresent
} from '../../api/index.js'
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
        { reg: /^(#|\/)?(联盟|聯盟)(报|報)(到|道)$/, fnc: 'userCheckin' },
        { reg: /^(#|\/)?(联盟|聯盟)(签|簽)到$/, fnc: 'userSignIn' },
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
   *
   * @param e
   * @returns
   */
  async userSignIn(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '联盟'))) return
    // 得到时间
    const nowTime = new Date()
    const lastSignTime = new Date(UserData.sign_time)
    const lastSignDay = lastSignTime.toDateString()
    // 检查
    if (lastSignDay === nowTime.toDateString()) {
      e.reply('[联盟]叶铭\n今日已签到')
      return
    }
    // 重置
    if (lastSignTime.getMonth() !== nowTime.getMonth()) {
      UserData.sign_size = 0
    }
    // 累计
    UserData.sign_size += 1
    // 得到时间
    UserData.sign_time = nowTime.getTime()
    // 满了
    if (UserData.sign_size > 28) {
      e.reply('[联盟]叶铭\n本月签到已满28天')
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
    // 灵力
    const spiritual = 100
    // 记录
    const size = UserData.special_spiritual + spiritual
    const limit = UserData.special_spiritual_limit
    // 声望
    const reputation = 20
    // 更新数据
    await GameApi.Users.update(UID, {
      special_reputation: UserData.special_reputation + reputation,
      special_spiritual: size <= limit ? size : limit
    } as DB.UserType)

    // 数量
    let ACCOUNT = 1

    // 基础物品
    const arr = []

    let name = '极品灵石'

    if (UserData.sign_size % 7 === 0) {
      name = '三转金丹'
      arr.push({
        name,
        acount: ACCOUNT
      })
      //
    } else {
      ACCOUNT = 2 * (UserData.sign_size % 7)
      arr.push({
        name,
        acount: ACCOUNT
      })
      arr.push()
    }

    // 读取活动条件
    const sky: DB.ActivityType = (await DB.activity.findOne({
      where: {
        name: '签到'
      },
      raw: true
    })) as any

    // 现在的时间戳
    const time = new Date().getTime()

    // 不在时间之内
    if (time <= sky.start_time || time >= sky.end_time) {
      arr.push({
        name: '玉香',
        acount: 1
      })
      // 添加物品
      await GameApi.Bag.addBagThing(UID, UserData.bag_grade, arr)
      // 更新用户
      await GameApi.Users.update(UID, {
        sign_size: UserData.sign_size,
        sign_time: UserData.sign_time
      } as DB.UserType)
      e.reply(
        `[联盟]叶铭\n本月连续签到${UserData.sign_size}天~\n[${name}]*${ACCOUNT}\n[灵力]*${spiritual}\n[声望]*${reputation}\n[玉香]*1`
      )

      return
    }

    const gaspractice = await GameApi.Levels.read(UID, 1).then(
      item => item.realm
    )

    const bodypractice = await GameApi.Levels.read(UID, 2).then(
      item => item.realm
    )

    const soul = await GameApi.Levels.read(UID, 3).then(item => item.realm)

    if (
      gaspractice < sky.gaspractice ||
      bodypractice < sky.bodypractice ||
      soul < sky.soul
    ) {
      // 境界不足  只能享受翻倍
      arr.push({
        name: '玉香',
        acount: 2
      })
      // 添加物品
      await GameApi.Bag.addBagThing(UID, UserData.bag_grade, arr)
      // 更新用户
      await GameApi.Users.update(UID, {
        sign_size: UserData.sign_size,
        sign_time: UserData.sign_time
      } as DB.UserType)
      e.reply(
        `[联盟]叶铭\n本月连续签到${UserData.sign_size}天~\n[${name}]*${ACCOUNT}\n[灵力]*${spiritual}\n[声望]*${reputation}\n[玉香]*2`
      )

      return
    }

    arr.push({
      name: '玉香',
      acount: 2
    })

    arr.push({
      name: '沉香',
      acount: 3
    })

    // 添加物品
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, arr)

    e.reply(
      `[联盟]叶铭\n本月连续签到${UserData.sign_size}天~\n[${name}]*${ACCOUNT}\n[灵力]*${spiritual}\n[声望]*${reputation}\n[玉香]*1\n[沉香]*3`
    )

    // 更新用户
    await GameApi.Users.update(UID, {
      sign_size: UserData.sign_size,
      sign_time: UserData.sign_time
    } as DB.UserType)

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
   *
   * @param e
   * @returns
   */
  async userCheckin(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '联盟'))) return
    const LevelData = await GameApi.Levels.read(UID, 1)
    // 既不等于0也不等于1
    if (LevelData.realm > 12) {
      e.reply('[修仙联盟]方正\n前辈莫要开玩笑')

      return
    }
    if (UserData.newcomer_gift != 0) {
      e.reply('[修仙联盟]方正\n道友要不仔细看看自己的储物袋')

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
    // 更新用户
    await GameApi.Users.update(UID, {
      newcomer_gift: 1
    } as DB.UserType)
    const randomthing = await GameApi.Goods.getRandomThing({
      commodities: 1
    })
    if (!randomthing) {
      e.reply('随机物品错误', {
        quote: e.msg_id
      })

      return
    }
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      {
        name: randomthing.name,
        acount: 1
      }
    ])
    e.reply(`[修仙联盟]方正\n看你骨骼惊奇\n就送你[${randomthing.name}]吧`)

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
