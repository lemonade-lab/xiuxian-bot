import { APlugin, type AEvent } from 'alemonjs'
import { levelUp } from 'xiuxian-api'
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
    return
  }

  /**
   * 破境
   * @param e
   * @returns
   */
  async breakingTheBoundary(e: AEvent) {
    levelUp(e, 7, 2, 80)
    return
  }

  /**
   * 頓悟
   * @param e
   * @returns
   */
  async insight(e: AEvent) {
    levelUp(e, 19, 3, 80)
    return
  }
}
