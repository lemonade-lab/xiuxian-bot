import { APlugin, type AEvent } from 'alemonjs'
import { lcalCacheImage } from 'xiuxian-utils'
import { Cooling } from 'xiuxian-core'

import { picture } from 'xiuxian-component'

export class MapHelp extends APlugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(修仙)?(地图|地圖)$/, fnc: 'showMap' },
        { reg: /^(#|\/)?修仙配置$/, fnc: 'boxDefset' }
      ]
    })
  }

  /**
   * 地图
   * @param e
   * @returns
   */
  async showMap(e: AEvent) {
    // 不变的图片做缓存处理
    const img = lcalCacheImage(`/public/img/map.jpg`)
    if (img) e.reply(img)
    return
  }

  /**
   * 修仙配置
   * @param e
   * @returns
   */
  async boxDefset(e: AEvent) {
    const img = await picture.render('Defsetcomponent', {
      name: 'boxDefset',
      cssName: 'new-defset',
      props: {
        data: Cooling
      }
    })
    if (typeof img != 'boolean') e.reply(img)
    return
  }
}
