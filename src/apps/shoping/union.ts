import { Messages } from 'alemonjs'
import { controlByName, sendReply, isThereAUserPresent } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'

const message = new Messages()

message.response(
  /^(#|\/)?(联盟商会|聯盟商會)(武器|护具|法宝|丹药|功法|道具|材料|装备)?$/,
  async e => {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '联盟'))) return
    const start_msg = []
    start_msg.push('\n[/兑换+物品名*数量]')
    const type = e.msg.replace(/^(#|\/)?(联盟商会|聯盟商會)/, '')
    const commoditiesList = await DB.goods
      .findAll({
        where: {
          alliancemall: 1,
          type: GameApi.Goods.mapType[type] ?? GameApi.Goods.mapType['道具']
        }
      })
      .then(res => res.map(item => item.dataValues))
    const end_msg = GameApi.Goods.getListMsg(commoditiesList, '声望')
    const msg = [...start_msg, ...end_msg]
    sendReply(e, '___[联盟商会]___', msg)
    return
  }
)

message.response(/^(#|\/)?(贡献|貢獻)[\u4e00-\u9fa5]+\*\d+$/, async e => {
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
  })
  e.reply(`[联盟]黄天霸\n贡献成功,奖励[声望]*${size}`)

  return
})

message.response(/^(#|\/)?(兑换|兌換)[\u4e00-\u9fa5]+\*\d+$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
  if (!(await controlByName(e, UserData, '联盟'))) return
  const [thingName, quantity] = e.msg
    .replace(/^(#|\/)?(兑换|兌換)/, '')
    .split('*')
  const ifexist = await DB.goods
    .findOne({
      where: {
        alliancemall: 1,
        name: thingName
      }
    })
    .then(res => res?.dataValues)
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
  })
  await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
    {
      name: ifexist.name,
      acount: Number(quantity)
    }
  ])
  e.reply(`[联盟]叶铭\n使用[声望]*${price}兑换了[${thingName}]*${quantity},`)
  return
})

message.response(/^(#|\/)?仙石兑换.*$/, async e => {
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

export const union = message.ok
