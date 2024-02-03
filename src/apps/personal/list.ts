import { plugin, type AEvent } from 'alemonjs'
import {
  obtainingImages,
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
    await e.reply(
      await obtainingImages('/public/pages/list.vue', await Server.getList())
    )
  }

  /**
   * 杀神榜
   * @param e
   * @returns
   */
  async killGodChart(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    await e.reply(
      await obtainingImages(
        '/public/pages/kill.vue',
        await Server.getKillList()
      )
    )
  }
}
