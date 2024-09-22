import * as DB from 'xiuxian-db'
import { type KillListType } from './types.js'
import { Redis } from 'xiuxian-db'

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
 * 得到杀神榜数据
 * @returns
 */
export async function getKillList() {
  //  得到玩家数据
  const ALLData = await DB.user
    .findAll({
      attributes: [
        'id',
        'uid',
        'battle_power',
        'autograph',
        'special_prestige',
        'name',
        'avatar'
      ],
      where: {
        delete: 1
      },
      order: [
        // 按照煞气降序排列
        ['special_prestige', 'DESC']
      ],
      limit: 5
    })
    .then(res => res.map(item => item.dataValues))
  //
  const UserData: KillListType[] = ALLData.map(item => {
    return {
      id: item.id,
      UID: item?.uid, // 编号
      autograph: item?.autograph, // 道宣
      lifeName: item?.name, // 道号
      prestige: item?.special_prestige, // 煞气
      power: item?.battle_power, // 战力
      UserAvatar: item?.avatar // 头像
    }
  })
  return UserData
}

export type killInformationType =
  ReturnType<typeof getKillList> extends Promise<infer T> ? T : never

// 更新杀神榜
export async function updataKillList() {
  // 写入缓存
  set(`xiuxian:list:kill`, JSON.stringify(await getKillList()))
}

// 启动的30秒计算一次,而后每小时刷新一次
setTimeout(() => {
  // 统计杀神榜
  updataKillList()
  console.info('[list] level update')
}, start_time)

setInterval(() => {
  // 统计杀神榜
  updataKillList()
}, continue_time)
