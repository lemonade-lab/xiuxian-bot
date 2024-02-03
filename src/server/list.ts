import * as List from './start.js'
import { KillListType, LevelListType } from './types.js'

/**
 * 杀神榜
 * @returns
 */
export async function killGodChart() {
  return {
    UserData: JSON.parse(await List.get(`xiuxian:list:kill`)) as KillListType[]
  }
}

/**
 * 排行榜
 * @returns
 */
export async function realmChart() {
  return {
    UserData: JSON.parse(await List.get(`xiuxian:list`)) as LevelListType[]
  }
}
