import { Messages } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?(储物袋|儲物袋|背包)(升级|升級)$/,
  async e => {
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
  }
)
