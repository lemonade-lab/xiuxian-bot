import { Image, useSend } from 'alemonjs'
import { pictureRender } from '@xiuxian/img/index'
import json_update from '@src/assets/defset/update.json'
const helpData = {}
export default OnResponse(
  async e => {
    const name = 'help-update'
    const Send = useSend(e)
    if (Object.prototype.hasOwnProperty.call(helpData, name)) {
      Send(Image(helpData[name], 'buffer'))
      return
    }
    const data = json_update
    // 得 buffer
    helpData[name] = await pictureRender('UpdateComponent', {
      data: data
    }).catch(console.error)
    Send(Image(helpData[name], 'buffer'))
    return
  },
  'message.create',
  /^(#|\/)?更新公告$/
)
