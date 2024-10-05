import { levels, Redis } from '@xiuxian/db/index'

/**
 *
 */
const rules = [
  { dayOfWeek: [2, 4], hour: 12, minute: 0 }, // 二四 12:00
  { dayOfWeek: [2, 4], hour: 13, minute: 59 }, // 二四 14:00
  { dayOfWeek: [1, 3, 5], hour: 18, minute: 0 }, // 一三五 18:00
  { dayOfWeek: [1, 3, 5], hour: 19, minute: 59 }, // 一三五 20:00
  { dayOfWeek: 6, hour: 20, minute: 0 }, // 周六 20:00
  { dayOfWeek: 6, hour: 21, minute: 59 } // 周六 21:00
]

/**
 *
 * @returns
 */
export const isBossActivityOpen = () => {
  const now = new Date()
  const currentDay = now.getDay()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  return rules.some(rule => {
    const isDayMatch = Array.isArray(rule.dayOfWeek)
      ? rule.dayOfWeek.includes(currentDay)
      : rule.dayOfWeek === currentDay

    const isTimeMatch =
      (rule.hour === currentHour && currentMinute <= rule.minute) ||
      rule.hour > currentHour

    return isDayMatch && isTimeMatch
  })
}
//
export const BOSS_DATA_KEY = 'xiuxian:boss:info'

type UserBattleType = {
  uid: string
  name: string
  battle_show: number
  battle_blood_now: number
  battle_attack: number
  battle_defense: number
  battle_blood_limit: number
  battle_critical_hit: number
  battle_critical_damage: number
  battle_speed: number
  battle_power: number
}

/**
 *
 * @param key
 * @returns
 */
export const getBossData = async (
  key: '1' | '2'
): Promise<{
  createAt: number
  level: string
  data: UserBattleType
} | null> => {
  const boss = await Redis.get(`${BOSS_DATA_KEY}:${key}`)
  return boss ? JSON.parse(boss) : null
}

/**
 *
 * @param key
 * @param data
 */
export const setBossData = (key: '1' | '2', data) => {
  return Redis.set(`${BOSS_DATA_KEY}:${key}`, JSON.stringify(data))
}

export const delBossData = (key: '1' | '2') => {
  return Redis.del(`${BOSS_DATA_KEY}:${key}`)
}

/**
 * @param key 1 金角 2 银角
 */
export const updateBossData = (key: '1' | '2') => {
  setTimeout(async () => {
    const level = key === '1' ? 41 : 28
    const b_size = 1000
    const a_size = 10
    const LevelMax = await levels
      .findOne({
        where: {
          id: level,
          type: 0
        }
      })
      .then(res => res?.dataValues)
    const data = {
      uid: '1',
      name: key === '1' ? '金角' : '银角',
      battle_show: 0,
      battle_attack:
        Math.floor(LevelMax.attack * ((level + 1) * 0.05 + 1)) * a_size,
      battle_defense: Math.floor(LevelMax.defense * ((level + 1) * 0.01 + 1)),
      // 血量重新计算 * size
      battle_blood_now: Math.floor(
        LevelMax.blood * ((level + 1) * 0.01 + 1) * b_size
      ),
      // 血量重新计算 * size
      battle_blood_limit: Math.floor(
        LevelMax.blood * ((level + 1) * 0.01 + 1) * b_size
      ),
      battle_critical_hit: level + 30,
      battle_critical_damage: LevelMax.critical_damage + level,
      battle_speed: LevelMax.speed + 10,
      battle_power: 0
    }
    // 创建boss
    Redis.set(
      `${BOSS_DATA_KEY}:${key}`,
      JSON.stringify({
        // 创建时间
        createAt: Date.now(),
        // 境界名
        level: LevelMax.name,
        // boss数据
        data: data
      })
    )
    //
  })
}
