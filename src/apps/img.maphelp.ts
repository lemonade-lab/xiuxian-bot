import { lcalCacheImage } from 'xiuxian-utils'
import { Messages } from 'alemonjs'
export default new Messages().response(
  /^(#|\/)?(修仙)?(地图|地圖)$/,
  async e => {
    // 不变的图片做缓存处理
    const img = lcalCacheImage(`/public/img/map.jpg`)
    if (img) e.reply(img)
  }
)
