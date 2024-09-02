import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { Bag, Cooling, operationLock } from 'xiuxian-core'
import { goods, transactions, user_bag } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?上架/, async e => {
  const T = await operationLock(e.user_id)
  if (!T) {
    e.reply('操作频繁')
    return
  }
  //
  const UID = e.user_id
  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return

  //  /上架物品名*数量*价格
  let [name, count, price] = e.msg
    .replace(/^(#|\/)?上架/, '')
    .trim()
    .split('*')

  count = String(Math.floor(isNaN(Number(count)) ? 1 : Number(count)))
  price = String(Math.floor(isNaN(Number(price)) ? 1 : Number(price)))

  // 查询物品
  const data = await transactions
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res?.dataValues)

  if (data) {
    e.reply('已有上架物品')
    return
  }

  const gData = await goods
    .findOne({
      where: {
        name: name
      }
    })
    .then(res => res?.dataValues)

  //
  if (!gData) {
    e.reply('出错物品，请联系管理员')
    return
  }

  if (Number(price) > gData.price * Cooling.MAX_PRICE_P * Number(count)) {
    e.reply('你在尝试违规定价,操作已取消')
    return
  }

  // 查询 物品
  const thing = await user_bag
    .findOne({
      where: {
        uid: UID,
        name: name
      }
    })
    .then(res => res?.dataValues)

  if (!thing) {
    e.reply('物品不存在')
    return
  }

  if (thing.acount < Number(count)) {
    e.reply(`[${thing.name}]*${thing.acount}物品不足`)
    return
  }

  //
  const createAt = new Date()

  await transactions
    .create({
      uid: UID,
      name: name,
      count: Number(count),
      price: Number(price),
      createAt: createAt
    })
    .then(async () => {
      // 减少物品
      await Bag.reduceBagThing(UID, [
        {
          name: thing.name,
          acount: thing.acount
        }
      ])
      e.reply('上架成功')
    })
    .catch(() => {
      // 确保物品被删除
      transactions.destroy({
        where: {
          uid: UID,
          name: name,
          createAt: createAt
        }
      })
      // 反馈情况
      e.reply('上架失败了')
    })

  //
})
