import { Messages } from 'alemonjs'
import { controlByName, isThereAUserPresent } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { Redis, user } from 'xiuxian-db'
export default new Messages().response(
  /^(#|\/)?出售[\u4e00-\u9fa5]+\*\d+$/,
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const KEY = `xiuxian:open:${e.user_id}`
    const LOCK = await Redis.get(KEY)
    if (LOCK) {
      e.reply('操作频繁')
      return
    }
    await Redis.set(KEY, 1, 'EX', 6)
    /**
     * lock end
     */

    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await user
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res.dataValues)
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
