import { Image, useSend } from 'alemonjs'
import { lcalCacheImage } from '@xiuxian/utils/index'
export default OnResponse(
  async e => {
    // 不变的图片做缓存处理
    const img = lcalCacheImage(`/public/img/map.jpg`)
    const Send = useSend(e)
    if (typeof img != 'boolean') {
      Send(Image(img, 'buffer'))
    } else {
      //
    }
  },
  'message.create',
  /^(#|\/)?(修仙)?(地图|地圖)$/
)
