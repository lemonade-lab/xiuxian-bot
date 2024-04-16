import { APlugin, Controllers, type AEvent } from 'alemonjs'
import {
  isThereAUserPresent,
  GameApi,
  victoryCooling,
  levelUp
} from '../../api/index.js'
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
    if (e.platform == 'ntqq') {
      Controllers(e).Message.reply(
        '',
        [
          { label: '储物袋', value: '/储物袋' },
          { label: '破境', value: '/破境' }
        ],
        [
          { label: '探索怪物', value: '/探索怪物' },
          { label: '修仙地图', value: '/修仙地图' }
        ]
      )
    }
    return
  }

  /**
   * 破境
   * @param e
   * @returns
   */
  async breakingTheBoundary(e: AEvent) {
    levelUp(e, 7, 2, 80)
    if (e.platform == 'ntqq') {
      Controllers(e).Message.reply(
        '',
        [
          { label: '储物袋', value: '/储物袋' },
          { label: '破境', value: '/破境' }
        ],
        [
          { label: '探索怪物', value: '/探索怪物' },
          { label: '修仙地图', value: '/修仙地图' }
        ]
      )
    }
    return
  }

  /**
   * 頓悟
   * @param e
   * @returns
   */
  async insight(e: AEvent) {
    levelUp(e, 19, 3, 80)
    if (e.platform == 'ntqq') {
      Controllers(e).Message.reply(
        '',
        [
          { label: '储物袋', value: '/储物袋' },
          { label: '破境', value: '/破境' }
        ],
        [
          { label: '探索怪物', value: '/探索怪物' },
          { label: '修仙地图', value: '/修仙地图' }
        ]
      )
    }
    return
  }
}
