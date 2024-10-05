import { controlByName, isUser } from '@xiuxian/api/index'
import * as DB from '@xiuxian/db/index'
import * as GameApi from '@xiuxian/core/index'

import { Text, useSend } from 'alemonjs'
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
      .then(res => res.map(item => item?.dataValues))
    // 计算金额
    for await (const item of bag) {
      money += item.acount * item['good']['dataValues']['price']
    }

    // 计算所得
    money = Math.floor(money * GameApi.Cooling.ExchangeEnd)

    // 出现错误
    if (isNaN(money) || money == 0) {
      Send(Text('没有物品'))

      return
    }

    // 删除所有
    await DB.user_bag.destroy({
      where: {
        uid: UID
      }
    })

    // 获得
    await GameApi.Bag.addBagThing(UID, [
      {
        name: '下品灵石',
        acount: money
      }
    ])

    Send(Text(`[万宝楼]欧阳峰:\n出售得${money}*[下品灵石]`))

    return
  },
  'message.create',
  /^(#|\/)?售出所有物品$/
)
