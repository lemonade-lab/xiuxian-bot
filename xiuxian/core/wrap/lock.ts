import { Redis } from 'xiuxian-db'
/**
 *
 * @param UID
 * @param callBack
 * @returns
 */
export const operationLock = async (UID: string) => {
  const KEY = `xiuxian:open:${UID}`
  // 当前的时间
  const LOCK = await Redis.get(KEY)
  // 现在的时间
  const TIME = Date.now()
  // 如果没有锁或者锁过期了
  if (!LOCK || Number(LOCK) + 1000 * 6 < TIME) {
    await Redis.set(KEY, TIME, 'EX', 6)
    return true
  }
  return false
}
