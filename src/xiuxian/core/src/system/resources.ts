import { Redis } from '@xiuxian/db/index'
/**
 * 得到数据
 * @param i
 * @returns
 */
export async function get(key: string) {
  /**
   * 读取缓存
   */
  const data = await Redis.get(key)
  if (data) {
    return convert(data)
  }
  return convert('{"time": 99, "resources": {}}')
}

/**
 *
 * @param data
 * @returns
 */
function convert(data: string) {
  const db = JSON.parse(data)
  if (typeof db == 'string') {
    return JSON.parse(db)
  }
  return db
}

/**
 * 写入数据
 * @param key
 * @param data
 */
export async function set(key: string, data: any) {
  Redis.set(key, JSON.stringify(data))
}

/**
 * 缓存数据
 * @param key
 * @param i
 * @param create
 * @returns
 */
export async function cache(key: string, i: number, create: any) {
  /**
   * 得到缓存
   */
  const data = await get(`${key}:${i}`)
  /**
   * 时间不同
   */
  if (data.time == new Date().getHours()) {
    return data.resources
  }
  /**
   * 新数据
   */
  data.time = new Date().getHours()
  /**
   * 保存资源
   */
  data.resources = create(i)
  /**
   * 重新写入
   */
  set(`${key}:${i}`, JSON.stringify(data))
  return data.resources
}
