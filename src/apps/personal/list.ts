import { plugin, type AEvent } from 'alemonjs'
import {
  getKillComponent,
  getListComponent,
  isThereAUserPresent,
  Server
} from '../../api/index.js'
export class List extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(天命榜|至尊榜|帝魂榜)$/, fnc: 'showList' },
        { reg: /^(#|\/)?杀神榜$/, fnc: 'killGodChart' }
      ]
    })
  }

  /**
   *天命榜
   * @param e
   * @returns
   */
  async showList(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const img = await getListComponent(await Server.getList())
    if (typeof img != 'boolean') e.reply(img)
  }

  /**
   * 杀神榜
   * @param e
   * @returns
   */
  async killGodChart(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const img = await getKillComponent(await Server.getKillList())

    if (typeof img != 'boolean') e.reply(img)
  }
}
