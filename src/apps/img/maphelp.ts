import { plugin, type AEvent } from 'alemonjs'
import { obtainingImages, lcalCacheImage } from '../../api/index.js'
import { Cooling } from '../../api/gameapi.js'
export class MapHelp extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)?(修仙地图|修仙地圖)$/, fnc: 'showMap' },
        { reg: /^(#|\/)?修仙配置$/, fnc: 'boxDefset' }
      ]
    })
  }

  /**
   * 修仙地图
   * @param e
   * @returns
   */
  async showMap(e: AEvent) {
    // 不变的图片做缓存处理
    const img = lcalCacheImage(`/public/img/map/map.jpg`)
    if (img) e.reply(img)
    return
  }

  /**
   * 修仙配置
   * @param e
   * @returns
   */
  async boxDefset(e: AEvent) {
    e.reply(await obtainingImages('/public/pages/defset.vue', Cooling))
    return
  }
}
