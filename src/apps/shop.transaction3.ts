import { Messages } from 'alemonjs'
import { controlByName, isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { user } from 'xiuxian-db'
import { operationLock } from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?出售[\u4e00-\u9fa5]+\*\d+$/,
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const T = await operationLock(e.user_id)
    if (!T) {
      e.reply('操作频繁')
      return
    }
    /**
     * lock end
     */

    const UID = e.user_id

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

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
    await GameApi.Bag.addBagThing(UID, [
      {
        name: '下品灵石',
        acount: commoditiesPrice
      }
    ])

    e.reply(`[万宝楼]欧阳峰:\n出售得${commoditiesPrice}*[下品灵石]`)

    return
  }
)
