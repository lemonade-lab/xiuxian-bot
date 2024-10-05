import { Image, useParse, useSend } from 'alemonjs'
import { pictureRender } from '@xiuxian/img/index'
import josn_base_help from '@public/defset/base_help.json'
const helpData = {}
export default OnResponse(
  async e => {
    const text = useParse(e.Megs, 'Text')
    if (!text) return
    const size = Number(text.replace(/^(#|\/)?(修仙(帮|幫)助|帮助)/, ''))
    const n = isNaN(size) ? 0 : size
    const name = `help${n}`
    const Send = useSend(e)
    if (Object.prototype.hasOwnProperty.call(helpData, name)) {
      Send(Image(helpData[name], 'buffer'))
      return
    }
    const data = josn_base_help
    helpData[name] = await pictureRender('HelpComponent', {
      name: name,
      props: { data: [data[n - 1] ?? (data[0] as any)] }
    }).catch(console.error)
    Send(Image(helpData[name], 'buffer'))
    return
  },
  'message.create',
  /^(#|\/)?(修仙(帮|幫)助|帮助)/
)
