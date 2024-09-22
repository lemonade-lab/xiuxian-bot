import { controlByName, isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'

import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    // lock start
    const T = await GameApi.operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }

    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    if (!(await controlByName(e, UserData, '万宝楼'))) return

    const text = useParse(e.Megs, 'Text')

    const type = text.replace(/^(#|\/)?售出所有/, '')

    // 金额累计
    let money = 0

    if (!Object.prototype.hasOwnProperty.call(GameApi.Goods.mapType, type)) {
      Send(Text('错误类型'))

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
      Send(Text('[蜀山派]叶铭\n一边去'))

      return
    }

    // 直接清除一个类型,必然会空出位置

    await DB.user_bag.destroy({
      where: {
        uid: UID,
        type: GameApi.Goods.mapType[type]
      }
    })

    // 增加下品灵石
    await GameApi.Bag.addBagThing(UID, [{ name: '下品灵石', acount: money }])

    Send(Text(`[蜀山派]叶铭\n出售得${money}*[下品灵石]`))

    return
  },
  'message.create',
  /^(#|\/)?售出所有(武器|护具|法宝|丹药|功法|道具|材料|装备)$/
)
