import { Image, Text, useParse, useSend } from 'alemonjs'
import { readFileSync } from 'fs'
import { join } from 'path'
import { pictureRender } from 'xiuxian-img'
const helpData = {}
const dir = join(process.cwd(), 'public', 'defset', 'base_help.json')
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
    const data = JSON.parse(readFileSync(dir, 'utf-8'))
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
    helpData[name] = await pictureRender('HelpComponent', {
      name: 'help' + name,
      props: { data: [db] }
    }).catch(console.error)
    Send(Image(helpData[name], 'buffer'))
  },
  'message.create',
  /^(#|\/)?(帮|幫)助打开[\u4e00-\u9fa5]+$/
)
