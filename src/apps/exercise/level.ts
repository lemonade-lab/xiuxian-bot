import { APlugin, Controllers, type AEvent } from 'alemonjs'
import { levelUp } from '../../api/index.js'
export class Level extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?突破$/, fnc: 'breakThrough' },
        { reg: /^(#|\/)?破境$/, fnc: 'breakingTheBoundary' },
        { reg: /^(#|\/)?(顿悟|頓悟)$/, fnc: 'insight' }
      ]
    })
  }

  /**
   * 突破
   * @param e
   * @returns
   */
  async breakThrough(e: AEvent) {
    levelUp(e, 6, 1, 90)
    this.buttons(e)
    return
  }

  async buttons(e: AEvent) {
    if (e.platform == 'ntqq') {
      Controllers(e).Message.reply('', [
        { label: '修仙帮助', value: '/修仙帮助' },
        { label: '地图', value: '/地图' },
        { label: '控制板', value: '/控制板' }
      ])
    }
  }

  /**
   * 破境
   * @param e
   * @returns
   */
  async breakingTheBoundary(e: AEvent) {
    levelUp(e, 7, 2, 80)
    this.buttons(e)
    return
  }

  /**
   * 頓悟
   * @param e
   * @returns
   */
  async insight(e: AEvent) {
    levelUp(e, 19, 3, 80)
    this.buttons(e)
    return
  }
}
