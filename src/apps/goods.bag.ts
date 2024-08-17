import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import { picture } from 'xiuxian-img'
import * as GameApi from 'xiuxian-core'
import { backpackInformation } from 'xiuxian-statistics'
import { Goods } from 'xiuxian-core'

const message = new Messages()

message.response(
  /^(#|\/)?(储物袋|儲物袋|背包)(武器|护具|法宝|丹药|功法|道具|材料|装备)?$/,
  async e => {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const type = e.msg.replace(/^(#|\/)?(储物袋|儲物袋|背包)/, '')
    const data = await backpackInformation(
      e.user_id,
      e.user_avatar,
      Goods.mapType[type] ?? Goods.mapType['道具']
    )
    const img = await picture.render('BagComponent', {
      props: { data },
      name: UID
    })
    if (typeof img != 'boolean') e.reply(img)
    return
  }
)

message.response(/^(#|\/)?(储物袋|儲物袋|背包)(升级|升級)$/, async e => {
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
  })
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
})

message.response(
  /^(#|\/)?(储物袋|儲物袋|背包)(丢弃|丟棄)[\u4e00-\u9fa5]+\*\d+$/,
  async e => {
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
)

export const Bags = message.ok
