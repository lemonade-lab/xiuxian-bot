import { APlugin, Controllers, type AEvent } from 'alemonjs'
import { getDefsetComponent, lcalCacheImage } from '../../api/index.js'
import { Cooling } from '../../api/gameapi.js'
export class MapHelp extends APlugin {
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
    const img = lcalCacheImage(`/public/img/map.jpg`)
    if (img) {
      e.reply(img).then(() => {
        Controllers(e).Message.reply(
          'buttons',
          [
            { label: '天山', value: '/前往天山' },
            { label: '极西', value: '/前往极西' },
            { label: '荒峰', value: '/前往荒峰' }
          ],
          [
            { label: '灭仙', value: '/前往灭仙' },
            { label: '乱坟', value: '/前往乱坟' },
            { label: '平川', value: '/前往平川' }
          ],
          [
            { label: '照阳', value: '/前往照阳' },
            { label: '中东', value: '/前往中东' },
            { label: '蛮狐', value: '/前往蛮狐' }
          ],
          [
            { label: '南海', value: '/前往南海' },
            { label: '北海', value: '/前往北海' },
            { label: '东海', value: '/前往东海' }
          ],
          [
            { label: '星海', value: '/前往星海' },
            { label: '联盟', value: '/前往联盟' },
            {
              label: '返回',
              value: '/返回'
            }
          ]
        )
      })
    }
    return
  }

  /**
   * 修仙配置
   * @param e
   * @returns
   */
  async boxDefset(e: AEvent) {
    const img = await getDefsetComponent(Cooling)
    if (typeof img != 'boolean') e.reply(img)
    return
  }
}
