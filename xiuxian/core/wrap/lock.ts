import { Redis } from 'xiuxian-db'
import { createUID } from 'xiuxian-utils'
/**
 *
 * @param UID
 * @param callBack
 * @returns
 */
export const operationLock = async (UID: string) => {
  const KEY = `xiuxian:open:${createUID(UID)}`
  // 当前的时间
  const LOCK = await Redis.get(KEY)
  // 现在的时间
  const TIME = Date.now()
  // 不存在锁
  if (!LOCK || TIME + 6000 > Number(LOCK)) {
    // 记录锁
    await Redis.set(KEY, TIME, 'EX', 6)
    // 放行
    return true
  }
  // 存在锁，锁没过期
  return false
}
