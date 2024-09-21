import { controlByName, isUser } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
import { operationLock } from 'xiuxian-core'
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
      .then(res => res.map(item => item.dataValues))
    // 计算金额
    for await (const item of bag) {
      money += item.acount * item['good']['dataValues']['price']
    }

    // 计算所得
    money = Math.floor(money * GameApi.Cooling.ExchangeEnd)

    // 出现错误
    if (isNaN(money) || money == 0) {
      e.reply('[蜀山派]叶铭\n一边去')
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

    // 发送
    e.reply(`[蜀山派]叶铭\n这是${money}*[下品灵石],道友慢走`)

    return
  },
  'message.create',
  /^(#|\/)?售出所有物品$/
)
