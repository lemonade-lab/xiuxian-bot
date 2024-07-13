import { cache, get, set } from './resources.js'
import { RedisExplore } from '../config/index.js'

const amap = {
    // 得到等级
    '1': '1.2',
    '2': '1.2',
    '3': '1.2',
    '4': '1.2',
    '5': '1.3',
    '6': '1.3',
    '7': '1.3',
    '8': '1.4',
    '9': '1.4',
    '10': '1.4',
    '11': '2.4',
    '12': '2.4',
    '13': '2.4'
    // 根据等级分配
  },
  map = {
    '1': '12000.15000',
    '2': '1100.1400',
    '3': '100.130',
    '4': '9.12'
  },
  cmap = {
    // 根据区域分配数量
    '1': '25.35',
    '2': '25.35',
    '3': '25.35',
    '4': '25.35',
    '5': '20.30',
    '6': '20.30',
    '7': '20.30',
    '8': '15.25',
    '9': '15.25',
    '10': '15.25',
    '11': '10.20',
    '12': '10.20',
    '13': '10.20'
  }

/**
 * 生成灵矿
 * @param i
 * @returns
 */
function createExplore(i: number) {
  const data = {},
    size = i > 8 ? 8 : i
  for (let j = 0; j < size; j++) {
    const [amini, amax] = amap[i].split('.')
    const grade = Math.floor(Math.random() * (amax - amini + 1)) + Number(amini)
    const [mini, max] = map[grade].split('.')
    const money = Math.floor(Math.random() * (max - mini + 1)) + Number(mini)
    const [cmini, cmax] = cmap[i].split('.')
    const acount =
      Math.floor(Math.random() * (cmax - cmini + 1)) + Number(cmini)
    const dmini = 1000,
      dmax = 9999
    const a = Math.floor(Math.random() * (dmax - dmini + 1)) + Number(dmini)
    data[a] = {
      money: money,
      grade: grade, // 等级
      spiritual: grade + 2, // 灵力消耗
      acount: acount // 数量
    }
  }
  return data
}

/**
 * 减少数量
 * @param i
 * @param name
 * @param size 默认为1
 * @returns
 */
export async function reduce(i: number, name: string, size = 1) {
  const data = await get(`${RedisExplore}:${i}`)
  if (!data.resources[name]) return

  data.resources[name].acount -= size

  // 清除记录
  if (data.resources[name].acount <= 1) {
    delete data.resources[name]
  }

  // 这还有时间呢
  set(`${RedisExplore}:${i}`, data)
  return
}

/**
 * 地域
 * @param i
 * @returns
 */
export async function explorecache(i: number) {
  return await cache(RedisExplore, i, createExplore)
}
