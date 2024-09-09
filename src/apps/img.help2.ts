import { Messages } from 'alemonjs'
import { readFileSync } from 'fs'
import { join } from 'path'
import { pictureRender } from 'xiuxian-img'
const helpData = {}
const dir = join(process.cwd(), 'public', 'defset', 'base_help.json')
export default new Messages().response(
  /^(#|\/)?(帮|幫)助打开[\u4e00-\u9fa5]+$/,
  async e => {
    const name = e.msg.replace(/^(#|\/)?(帮|幫)助打开/, '')
    if (!name || name == '') {
      e.reply('错误查询')
      return
    }
    // 缓存不存在
    if (Object.prototype.hasOwnProperty.call(helpData, name)) {
      e.reply(helpData[name])
      return
    }
    //
    const data = JSON.parse(readFileSync(dir, 'utf-8'))
    //
    if (!Array.isArray(data)) {
      e.reply('数据读取错误')
      return
    }
    //
    const db = data.find(item => item.group == name)
    if (!db) {
      e.reply('错误查询')
      return
    }
    //
    helpData[name] = await pictureRender('HelpComponent', {
      name: 'help' + name,
      props: { data: [db] }
    }).catch(console.error)
    //
    e.reply(helpData[name])
  }
)
