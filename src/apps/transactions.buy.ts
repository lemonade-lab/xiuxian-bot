import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import { Bag, operationLock, order } from 'xiuxian-core'
import { Redis, transactions, user_bag } from 'xiuxian-db'
import { createUID } from 'xiuxian-img'

export default new Messages().response(/^(#|\/)?选购/, async e => {
  const T = await operationLock(e.user_id)
  if (!T) {
    e.reply('操作频繁')
    return
  }
  //
  const UID = e.user_id
  const UserData = await isUser(e, UID)
  if (typeof UserData === 'boolean') return

  const id = e.msg.replace(/^(#|\/)?选购/, '').trim()
  if (!id || id == '' || isNaN(Number(id))) {
    e.reply('请输入正确的编号')
    return
  }

  // 查询物品
  const data = await transactions
    .findOne({
      where: {
        id: Number(id)
      }
    })
    .then(res => res?.dataValues)

  if (!data) {
    e.reply('没有找到该物品')
    return
  }

  if (data.uid == UID) {
    e.reply('不能购买自己的物品')
    return
  }

  // 查询下品灵石
  const money = await user_bag
    .findOne({
      where: {
        uid: UID,
        name: '下品灵石'
      }
    })
    .then(res => res?.dataValues)

  //
  if (!money) {
    e.reply('没有找到下品灵石')
    return
  }

  const Value = Math.floor(data.price * 0.1)
  const needMoeny = data.price + Value
  const getMoeny = data.price - Value

  if (data.price > money.acount) {
    e.reply(`下品灵石不足${needMoeny}(+${Value})`)
    return
  }

  const BagSize = await Bag.backpackFull(UID)
  // 背包未位置了直接返回了
  if (!BagSize) {
    e.reply(['储物袋空间不足'], {
      quote: e.msg_id
    })
    return
  }

  // 交易
  const Del = await order.delThing(data.id)

  if (!Del) {
    e.reply('交易频繁')
    return
  }

  // 扣钱
  await Bag.reduceBagThing(UID, [
    {
      name: '下品灵石',
      acount: needMoeny
    }
  ])

  // 加物品
  await Bag.addBagThing(UID, [
    {
      name: data.name,
      acount: data.count
    }
  ])

  // 存入
  const KEY = `xiuxian:money:${createUID(data.uid)}`
  await Redis.set(KEY, `下品灵石*${getMoeny}`)

  e.reply('购买成功')

  return
})
