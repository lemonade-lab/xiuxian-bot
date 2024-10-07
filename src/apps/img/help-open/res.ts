import { Image, Text, useParse, useSend } from 'alemonjs'
import { pictureRender } from '@xiuxian/img/index'
import josn_base_help from '@src/assets/defset/base_help.json'
const helpData = {}
export default OnResponse(
  async e => {
    const text = useParse(e.Megs, 'Text')
    if (!text) return
    const name = text.replace(/^(#|\/)?(帮|幫)助打开/, '')
    const Send = useSend(e)
    if (!name || name == '') {
      Send(Text('错误查询'))
      return
    }
    // 缓存不存在
    if (Object.prototype.hasOwnProperty.call(helpData, name)) {
      Send(Image(helpData[name], 'buffer'))
      return
    }
    //
    const data = josn_base_help
    //
    if (!Array.isArray(data)) {
      Send(Text('数据读取错误'))
      return
    }
    //
    const db = data.find(item => item.group == name)
    if (!db) {
      Send(Text('错误查询'))
      return
    }
    //
    helpData[name] = await pictureRender(
      'HelpComponent',
      {
        data: [db as any]
      },
      name
    ).catch(console.error)
    Send(Image(helpData[name], 'buffer'))
  },
  'message.create',
  /^(#|\/)?(帮|幫)助打开[\u4e00-\u9fa5]+$/
)
