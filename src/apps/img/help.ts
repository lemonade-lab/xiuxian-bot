import { APlugin, Controllers, type AEvent } from 'alemonjs'
import { postHelp } from '../../api/index.js'
import { QQ_GROUP } from '../../model/config/index.js'
export class Help extends APlugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)?(修仙(帮|幫)助|帮助)$/, fnc: 'getBaseHelp' }]
    })
  }

  /**
   *
   * @param e
   * @returns
   */
  async getBaseHelp(e: AEvent) {
    // 是ntqq就不再需要帮助图了
    if (e.platform == 'ntqq') {
      Controllers(e).Message.reply('', [
        {
          label: '加入官群',
          link: QQ_GROUP
        },
        {
          label: '地图',
          value: '/地图'
        },
        { label: '控制板', value: '/控制板' }
      ])
    } else {
      postHelp(e, 'base_help')
    }
    return
  }
}
