import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
import { user_bag_message } from 'xiuxian-db'
export default OnResponse(
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const T = await operationLock(e.UserId)
    if (!T) {
      e.reply('操作频繁')
      return
    }
    /**
     * lock end
     */

    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const UserBgData = await user_bag_message
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res.dataValues)

    // 等级
    let grade = UserBgData.grade

    // 等级
    const Price = GameApi.Cooling.Price[grade]

    //
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

    await user_bag_message.update(
      {
        grade: grade
      },
      {
        where: {
          uid: UID
        }
      }
    )

    // 扣灵石
    await GameApi.Bag.reduceBagThing(UID, [
      {
        name: '下品灵石',
        acount: Price
      }
    ])

    //
    e.reply([`花了${Price}*[下品灵石]升级\n目前储物袋等级为${grade}`], {
      quote: e.msg_id
    })
    return
  },
  'message.create',
  /^(#|\/)?(储物袋|儲物袋|背包)(升级|升級)$/
)
