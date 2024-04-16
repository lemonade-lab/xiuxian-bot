import * as DB from '../db/index.js'
import { type LevelListType, type KillListType } from './types.js'
import { Redis } from '../db/redis/index.js'
import { isUser } from '../api/msgapi.js'
import { Equipment, Skills } from '../api/gameapi.js'

// 启动刷新时间   // 一小时刷新一次  // 响应控制
const start_time = 30000
const continue_time = 3600000

/**
 * 得到
 * @param i
 * @returns
 */
export async function get(i: string) {
  const data = await Redis.get(i)
  if (data) return data
  return '[]'
}

/**
 * 设置
 * @param i
 * @param val
 */
export function set(i: string, val: any) {
  Redis.set(i, val)
}

/**
 * 得到排行榜数据
 * @returns
 */
export async function getList() {
  const UserData: LevelListType[] = []

  //  得到玩家数据
  const ALLData: DB.UserType[] = (await DB.user.findAll({
    attributes: ['uid', 'battle_power', 'autograph', 'name', 'avatar'],
    order: [
      ['battle_power', 'DESC'] // 按照战力降序排列
    ],
    limit: 5,
    raw: true
  })) as any

  for (const iten of ALLData) {
    const LData: DB.UserLevelType[] = (await DB.user_level.findAll({
      attributes: ['type', 'realm'],
      where: {
        uid: iten?.uid
      },
      order: [
        ['type', 'ASC'] // 按类型排序
      ],
      raw: true
    })) as any
    let levelName = ''
    for (const it of LData) {
      // 得到 境界类型
      const type = it?.type
      const realm = it?.realm
      const levelsData: DB.LevelsType[] = (await DB.levels.findAll({
        where: {
          grade: realm,
          type: type
        },
        raw: true
      })) as any
      // 得到境界的名字
      levelName += `[${levelsData[0]?.name}]`
    }
    UserData.push({
      UID: iten?.uid, // 编号
      autograph: iten?.autograph, // 道宣
      lifeName: iten?.name, // 道号
      levelName: levelName, // 境界名
      power: iten?.battle_power, // 战力
      user_avatar: iten?.avatar // 头像
    })
  }

  /**
   * 给前五名增加 数据刷新操作
   */
  for await (const item of ALLData) {
    isUser(item.uid).then(UserData => {
      if (!UserData) return
      Promise.all([
        Skills.updataEfficiency(UserData.uid, UserData.talent),
        Equipment.updatePanel(UserData.uid, UserData.battle_blood_now)
      ])
    })
  }

  return UserData
}

/**
 * 得到杀神榜数据
 * @returns
 */
export async function getKillList() {
  //  得到玩家数据
  const ALLData: DB.UserType[] = (await DB.user.findAll({
    attributes: [
      'uid',
      'battle_power',
      'autograph',
      'special_prestige',
      'name',
      'avatar'
    ],
    order: [
      // 按照煞气降序排列
      ['special_prestige', 'DESC']
    ],
    limit: 5,
    raw: true
  })) as any
  const UserData: KillListType[] = ALLData.map(item => {
    return {
      UID: item?.uid, // 编号
      autograph: item?.autograph, // 道宣
      lifeName: item?.name, // 道号
      prestige: item?.special_prestige, // 煞气
      power: item?.battle_power, // 战力
      user_avatar: item?.avatar // 头像
    }
  })
  return UserData
}

// 更新至尊榜
export async function updatePowerList() {
  // 写入缓存
  set(`xiuxian:list`, JSON.stringify(await getList()))
}

// 更新杀神榜
export async function updataKillList() {
  // 写入缓存
  set(`xiuxian:list:kill`, JSON.stringify(await getKillList()))
}

// 启动的30秒计算一次,而后每小时刷新一次
setTimeout(() => {
  // 统计杀神榜
  updataKillList()
  // 统计至尊榜
  updatePowerList()
  console.info('[list] level update')
}, start_time)

setInterval(() => {
  // 统计杀神榜
  updataKillList()
  // 统计至尊榜
  updatePowerList()
}, continue_time)
