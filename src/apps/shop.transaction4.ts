import { Messages } from 'alemonjs'
import { controlByName, isThereAUserPresent } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(
  /^(#|\/)?售出所有(武器|护具|法宝|丹药|功法|道具|材料|装备)$/,
  async e => {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const UserData = await GameApi.Users.read(UID)
    if (!(await controlByName(e, UserData, '万宝楼'))) return
    const type = e.msg.replace(/^(#|\/)?售出所有/, '')

    // 金额累计
    let money = 0

    if (!Object.prototype.hasOwnProperty.call(GameApi.Goods.mapType, type)) {
      e.reply('错误类型', {
        quote: e.msg_id
      })

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
      e.reply('[蜀山派]叶铭\n一边去')

      return
    }

    // 直接清除一个类型,必然会空出位置
    await GameApi.Bag.del(UID, [GameApi.Goods.mapType[type]])

    // 增加下品灵石
    await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
      { name: '下品灵石', acount: money }
    ])

    // 反馈
    e.reply(`[蜀山派]叶铭\n这是${money}*[下品灵石],道友慢走`)

    return
  }
)
