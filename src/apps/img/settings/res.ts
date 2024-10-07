import { Image, useSend } from 'alemonjs'
import { Cooling } from '@xiuxian/core/index'
import { pictureRender } from '@xiuxian/img/index'
export default OnResponse(
  async e => {
    const img = await pictureRender('Defsetcomponent', {
      data: Cooling
    })
    const Send = useSend(e)
    if (typeof img != 'boolean') {
      Send(Image(img, 'buffer'))
    } else {
      //
    }
    return
  },
  'message.create',
  /^(#|\/)?修仙配置$/
)
