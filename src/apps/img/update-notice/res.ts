import { Image, useSend } from 'alemonjs'
import { readFileSync } from 'fs'
import { join } from 'path'
import { pictureRender } from '@xiuxian/img/index'
const helpData = {}
const dir = join(process.cwd(), 'public', 'defset', 'update.json')
export default OnResponse(
  async e => {
    const name = 'help-update'
    const Send = useSend(e)
    if (Object.prototype.hasOwnProperty.call(helpData, name)) {
      Send(Image(helpData[name], 'buffer'))
      return
    }
    const data = JSON.parse(readFileSync(dir, 'utf-8'))
    // 得 buffer
    helpData[name] = await pictureRender('UpdateComponent', {
      name: name,
      props: { data: data }
    }).catch(console.error)
    Send(Image(helpData[name], 'buffer'))
    return
  },
  'message.create',
  /^(#|\/)?更新公告$/
)
