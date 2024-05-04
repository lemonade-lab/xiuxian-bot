import * as List from './start.js'
import { KillListType } from './types.js'

/**
 * 杀神榜
 * @returns
 */
export async function killGodChart() {
  return {
    UserData: JSON.parse(await List.get(`xiuxian:list:kill`)) as KillListType[]
  }
}
