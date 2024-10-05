import { user_ring } from '@xiuxian/db/index'
import { searchAllThing } from '../../wrap/goods.js'
import { literal } from 'sequelize'
import { acquireLock, releaseLock } from '../../wrap/lock.js'

/**
 * 给UID添加物品
 * @param UID
 * @param arr
 * @returns
 */
export async function addRingThing(
  UID: string,
  arr: {
    name: string
    acount: number
  }[],
  grade = 1
) {
  const resource = `bag:${UID}`
  const lockValue = await acquireLock(resource)
  try {
    for (const { name, acount } of arr) {
      const THING = await searchAllThing(name)
      if (!THING) continue
      const length = await user_ring.count({
        where: {
          uid: UID,
          name: name
        }
      })
      // 当前储物袋格子已到极限
      if (length >= grade * 10) break
      // 查找物品
      const existingItem = await user_ring
        .findOne({
          where: {
            uid: UID,
            name: name
          }
        })
        .then(res => res?.dataValues)
      // 存在则更新
      if (existingItem) {
        await user_ring.update(
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
        await user_ring.create({
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
  return
}

/**
 * 给UID减少物品
 * @param UID
 * @param arr
 * @returns
 */
export async function reduceRingThing(
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
      const data = await searchRingByName(UID, name)
      // 不存在该物品
      if (!data) continue
      // 计算
      const ACCOUNT = Number(data.acount) - Number(acount)
      // 有效数量
      if (ACCOUNT >= 1) {
        await user_ring.update(
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
      await user_ring.destroy({
        where: {
          uid: UID,
          name: name
        }
      })
    }
  } finally {
    await releaseLock(resource, lockValue)
  }

  return true
}

/**
 * 检查戒指是否已满
 * @param UID
 * @returns
 */
export async function backpackFull(UID: string, grade = 1) {
  const length = await user_ring.count({
    where: {
      uid: UID
    }
  })
  // 等级一直是1
  const size = grade * 10
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
export async function searchRingByName(UID: string, name: string) {
  const data = await user_ring
    .findOne({
      where: {
        uid: UID,
        name
      }
    })
    .then(res => res?.dataValues)
  if (data)
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
export async function delThing(UID: string) {
  const data = await user_ring
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
  reduceRingThing(UID, [
    {
      name: data.name,
      acount: data.acount
    }
  ])
  return [data]
}
