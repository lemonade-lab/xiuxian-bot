import { user_bag, user_bag_message } from 'xiuxian-db'
import { literal } from 'sequelize'
import { searchAllThing } from '../../wrap/goods.js'
import { acquireLock, releaseLock } from '../../wrap/lock.js'

/**
 * 给UID添加物品
 * @param UID
 * @param arr
 * @returns
 */
export async function addBagThing(
  UID: string,
  arr: {
    name: string
    acount: number
  }[]
) {
  const resource = `bag:${UID}`
  const lockValue = await acquireLock(resource)
  try {
    const bag_message = await user_bag_message
      .findOne({
        where: {
          uid: UID
        }
      })
      .then(res => res.dataValues)
    for (const { name, acount } of arr) {
      const THING = await searchAllThing(name)
      if (!THING) continue
      const length = await user_bag.count({
        where: {
          uid: UID,
          name: name
        }
      })
      // 当前储物袋格子已到极限
      if (length >= bag_message.grade * 10) break
      // 查找物品
      const existingItem = await user_bag
        .findOne({
          where: {
            uid: UID,
            name: name
          }
        })
        .then(res => res?.dataValues)
      // 存在则更新
      if (existingItem) {
        await user_bag.update(
          {
            acount: Number(existingItem.acount) + Number(acount)
          },
          {
            where: {
              uid: UID,
              name: THING.name
            }
          }
        )
      } else {
        // 如果物品不存在，则创建新数据条目
        await user_bag.create({
          uid: UID, //编号
          tid: THING.id, // 物品编号
          type: THING.type, //物品类型
          name: THING.name, // 物品名
          acount: acount // 物品数量
        })
      }
    }
  } finally {
    await releaseLock(resource, lockValue)
  }
}

/**
 * 给UID减少物品
 * @param UID
 * @param arr
 * @returns
 */
export async function reduceBagThing(
  UID: string,
  arr: {
    name: string
    acount: number
  }[]
) {
  const resource = `bag:${UID}`
  const lockValue = await acquireLock(resource)
  try {
    for (const { name, acount } of arr) {
      const data = await searchBagByName(UID, name)
      // 不存在该物品
      if (!data) continue
      // 计算
      const ACCOUNT = Number(data.acount) - Number(acount)
      // 有效数量
      if (ACCOUNT >= 1) {
        await user_bag.update(
          {
            acount: ACCOUNT
          },
          {
            where: {
              uid: UID,
              name: name
            }
          }
        )
        continue
      }
      // 删除该物品
      await user_bag.destroy({
        where: {
          uid: UID,
          name: name
        }
      })
    }
  } finally {
    await releaseLock(resource, lockValue)
  }
}

/**
 * 检查储物袋是否已满
 * @param UID
 * @returns
 */
export async function backpackFull(UID: string) {
  const bag_message = await user_bag_message
    .findOne({
      where: {
        uid: UID
      }
    })
    .then(res => res.dataValues)
  const length = await user_bag.count({
    where: {
      uid: UID
    }
  })
  const size = bag_message.grade * 10
  const n = size - length
  // 至少有空位置的时候返回n
  return n >= 1 ? n : false
}

/**
 * 搜索UID的储物袋有没有物品名为NAME
 * @param UID
 * @param name
 * @returns
 */
export async function searchBagByName(UID: string, name: string, acount = 1) {
  const data = await user_bag
    .findOne({
      where: {
        uid: UID,
        name
      }
    })
    .then(res => res?.dataValues)
  if (data && data.acount >= acount)
    return {
      ...(await searchAllThing(name)),
      acount: data.acount
    }
  return false
}

/**
 * 随机掉一个物品,
 * 并把物品名返回,
 * 如果没有则返回为空[]
 * @param UID
 * @returns
 */
export async function delThing(UID: string, size = 100, t = false) {
  /**
   *
   */

  const data = await user_bag
    .findOne({
      where: {
        uid: UID
      },
      // 进行随机排序
      order: literal('RAND()')
    })
    .then(res => res?.dataValues)

  if (!data) return []
  // 击碎

  if (t) {
    if (data.acount <= 11) {
      reduceBagThing(UID, [
        {
          name: data.name,
          acount: data.acount
        }
      ])
    } else if (data.acount >= 102 && data.acount >= 12) {
      reduceBagThing(UID, [
        {
          name: data.name,
          acount: Math.floor(data.acount / 10)
        }
      ])
    } else {
      // 101/100 == 1
      reduceBagThing(UID, [
        {
          name: data.name,
          acount: Math.floor(data.acount / size) + 100
        }
      ])
    }
  } else {
    reduceBagThing(UID, [
      {
        name: data.name,
        acount: data.acount
      }
    ])
  }
  return [data]
}
