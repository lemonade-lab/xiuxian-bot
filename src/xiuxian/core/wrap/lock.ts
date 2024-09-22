import { Redis } from 'xiuxian-db'
import { createUID } from 'xiuxian-utils'
import { v4 as uuidv4 } from 'uuid'
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

export async function acquireLock(resource: string, ttl: number = 5000) {
  const lockKey = `lock:${resource}`
  const lockValue = uuidv4()
  while (true) {
    const result = await Redis.set(lockKey, lockValue, 'PX', ttl, 'NX')
    if (result === 'OK') {
      return lockValue
    }
    // 如果锁已经存在，等待一段时间后重试
    await new Promise(resolve => setTimeout(resolve, 300))
  }
}

export async function releaseLock(resource: string, lockValue: string) {
  const lockKey = `lock:${resource}`
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `
  await Redis.eval(script, 1, lockKey, lockValue)
}
