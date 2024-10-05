import { transactions, transactions_logs } from '@xiuxian/db/index'
import { acquireLock, releaseLock } from '../wrap/lock.js'

/**
 *
 * @param ID
 */
export async function delThing(ID: number) {
  const resource = `order:${ID}`
  const lockValue = await acquireLock(resource)
  let t = false
  try {
    // 搜索物品。
    const data = await transactions
      .findOne({
        where: {
          id: ID
        }
      })
      .then(res => res?.dataValues)

    if (!data) return t

    // 删除交易物品
    await transactions.destroy({
      where: {
        id: data.id
      }
    })

    // 添加购买记录
    await transactions_logs.create({
      ...data,
      updateAt: new Date(),
      deleteAt: new Date()
    })

    t = true
  } finally {
    await releaseLock(resource, lockValue)
    return t
  }
}
