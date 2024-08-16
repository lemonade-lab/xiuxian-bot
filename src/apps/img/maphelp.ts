import { lcalCacheImage } from 'xiuxian-utils'
import { Cooling } from 'xiuxian-core'
import { picture } from 'xiuxian-component'
import { Messages } from 'alemonjs'
const message = new Messages()
message.response(/^(#|\/)?(修仙)?(地图|地圖)$/, async e => {
  // 不变的图片做缓存处理
  const img = lcalCacheImage(`/public/img/map.jpg`)
  if (img) e.reply(img)
})
message.response(/^(#|\/)?修仙配置$/, async e => {
  const img = await picture.render('Defsetcomponent', {
    name: 'boxDefset',
    cssName: 'new-defset',
    props: {
      data: Cooling
    }
  })
  if (typeof img != 'boolean') e.reply(img)
  return
})
export const MapHelp = message.ok
