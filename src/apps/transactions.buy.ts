import { Messages } from 'alemonjs'
import { acquireLock, Bag, operationLock } from 'xiuxian-core'
import { transactions, transactions_logs, user, user_bag } from 'xiuxian-db'

const TypingItem = {
  '1': '下品灵石',
  '2': '中品灵石',
  '3': '上品灵石',
  '4': '极品灵石'
}

const TypingValue = {
  '1': 1,
  '2': 10,
  '3': 100,
  '4': 1000
}

const TransactionMap = new Map()

export default new Messages().response(/^(#|\/)测试$/, async e => {
  const T = await operationLock(e.user_id)
  if (!T) {
    e.reply('操作频繁')
    return
  }
  // //
  // const body = ctx.request.body as {
  //     id: number
  //     typing: number
  // }
  // // console.log('body-delete', body)
  // if (!body.id) {
  //     e.reply('非法请求')
  //     return
  // }
  // const key = `transactions:${body.id}`
  // acquireLock(key)
  // if (TransactionMap.has(body.id)) {
  //     e.reply('请求频繁')
  //     return
  // }
  // //
  // //
  // TransactionMap.set(body.id, 0)
  // // 顺便得到该物品的主人信息
  // const data = await transactions
  //     .findOne({
  //         where: {
  //             id: body.id
  //         },
  //         include: [
  //             {
  //                 model: user
  //             }
  //         ]
  //     })
  //     .then(res => res?.dataValues)
  // // 得到该物品的uid
  // const UID = e.user_id
  // if (data.uid == UID) {
  //     e.reply('不可购买')
  //     TransactionMap.delete(body.id)
  //     return
  // }
  // // 矫正类型
  // if (
  //     !body?.typing ||
  //     !Object.prototype.hasOwnProperty.call(TypingItem, body.typing)
  // ) {
  //     body.typing = 1
  // }
  // // 查询下品灵石
  // const money = await user_bag
  //     .findOne({
  //         where: {
  //             uid: UID,
  //             name: TypingItem[body.typing]
  //         }
  //     })
  //     .then(res => res?.dataValues)
  // const needMoeny = Math.floor((data.price * 1.1) / TypingValue[body.typing])
  // const getMoeny = Math.floor((data.price * 0.9) / TypingValue[body.typing])
  // if (money.acount < needMoeny) {
  //     e.reply('灵石不足')
  //     TransactionMap.delete(body.id)
  //     return
  // }
  // await transactions
  //     .destroy({
  //         where: {
  //             id: data.id
  //         }
  //     })
  //     .finally(() => {
  //         transactions_logs.create({
  //             ...data,
  //             updateAt: new Date(),
  //             deleteAt: new Date()
  //         })
  //     })
  //     .catch(() => { })
  // // 扣钱
  // await Bag.reduceBagThing(UID, [
  //     {
  //         name: TypingItem[body.typing],
  //         acount: needMoeny
  //     }
  // ])
  // // 加物品
  // await Bag.addBagThing(UID, [
  //     {
  //         name: data.name,
  //         acount: data.count
  //     }
  // ])
  // // 得到收益
  // await Bag.addBagThing(data.uid, [
  //     {
  //         name: TypingItem[body.typing],
  //         acount: getMoeny
  //     }
  // ])
  // e.reply('购买成功')
  // TransactionMap.delete(body.id)
  // return
})
