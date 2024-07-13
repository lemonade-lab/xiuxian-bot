import { APlugin, Controllers, type AEvent } from 'alemonjs'
import { postHelp } from '../../api/index.js'
import { Config } from 'xiuxian-core'
export class Help extends APlugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)?(修仙(帮|幫)助|帮助)$/, fnc: 'getBaseHelp' }]
    })
  }

  /**
   * @param e
   * @returns
   */
  async getBaseHelp(e: AEvent) {
    Controllers(e).Message.reply('', [
      {
        label: '加入官群',
        link: Config.QQ_GROUP
      },
      {
        label: '地图',
        value: '/地图'
      },
      { label: '控制板', value: '/控制板' }
    ])
    postHelp(e, 'base_help')
    return
  }
}
