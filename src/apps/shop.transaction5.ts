import { Messages } from 'alemonjs'
import { controlByName, isThereAUserPresent } from 'xiuxian-api'
import * as DB from 'xiuxian-db'
import * as GameApi from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?售出所有物品$/, async e => {
  const UID = e.user_id
  if (!(await isThereAUserPresent(e, UID))) return
  const UserData = await GameApi.Users.read(UID)
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
  await GameApi.Bag.del(UID)

  // 获得
  await GameApi.Bag.addBagThing(UID, UserData.bag_grade, [
    {
      name: '下品灵石',
      acount: money
    }
  ])

  // 发送
  e.reply(`[蜀山派]叶铭\n这是${money}*[下品灵石],道友慢走`)

  return
})
