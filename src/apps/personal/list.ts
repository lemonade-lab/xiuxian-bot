import { APlugin, type AEvent } from 'alemonjs'
import { isThereAUserPresent } from 'xiuxian-api'

import { picture } from 'xiuxian-component'

import * as Server from 'xiuxian-statistics'
export class List extends APlugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)?杀神榜$/, fnc: 'killGodChart' }]
    })
  }

  /**
   * 杀神榜
   * @param e
   * @returns
   */
  async killGodChart(e: AEvent) {
    const UID = e.user_id
    if (!(await isThereAUserPresent(e, UID))) return
    const data = await Server.getKillList()
    const img = await picture.render('KillComponent', {
      cssName: 'new-kill',
      name: UID,
      props: {
        data
      }
    })
    if (typeof img != 'boolean') e.reply(img)
  }
}
