import { monster } from 'xiuxian-db'
import { cache, get, set } from './resources.js'
import { RedisMonster } from '../config/index.js'
/**
 *  地点编号  最低等级  -- 最高等级
 */
const map = {
  '1': '1.4',
  '2': '1.8',
  '3': '2.11',
  '4': '4.14',
  '5': '7.17',
  '6': '10.20',
  '7': '10.23',
  '8': '10.26',
  '9': '10.29',
  '10': '20.32',
  '11': '20.35',
  '12': '20.38',
  '13': '30.42'
}

type FullType = { id: number; name: string; type: number; grade: number }[]

const full: FullType = await monster
  .findAll({})
  .then(res => res.map(item => item.dataValues))
  .then(res => {
    const data: any = res
    return data
  })

/**
 * 生成怪物
 * @param i
 * @returns
 */
function createMonster(i: number) {
  // 最低等级  最高等级
  const [mini, max] = map[i].split('.')
  // 当前地点怪物名{ 属性 }
  const monsters: {
    [ket: string]: {
      type: number
      level: number
      acount: number
    }
  } = {}
  // 一个地点最多生成10个怪
  const maxSize = max > 10 ? 10 : max
  // 增加
  for (let j = 0; j < maxSize; j++) {
    // 得到怪物境界
    const alevel = Math.floor(Math.random() * (max - mini + 1) + Number(mini))
    const now = full.filter(item => alevel > item.grade)
    const mon = now[Math.floor(Math.random() * now.length)]
    if (!Object.prototype.hasOwnProperty.call(monsters, mon.name)) {
      monsters[mon.name] = {
        type: mon.type, // 怪物类型
        level: alevel, // 怪物境界
        acount: 150 - alevel * 2 // 怪物数量
      }
    }
  }
  return monsters
}

/**
 * 减少数量
 * @param i
 * @param name
 * @returns
 */
export async function reduce(i: number, name: string, size = 1) {
  const data = await get(`${RedisMonster}:${i}`)
  if (!data.resources[name]) return

  data.resources[name].acount -= size

  // 清除记录
  if (data.resources[name].acount <= 1) {
    delete data.resources[name]
  }

  // 这还有时间呢
  set(`${RedisMonster}:${i}`, data)
  return
}

/**
 * 地域
 * @param i
 * @returns
 */
export async function monsterscache(i: number) {
  return await cache(RedisMonster, i, createMonster)
}
