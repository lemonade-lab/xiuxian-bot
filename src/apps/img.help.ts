import { Messages } from 'alemonjs'
import { readFileSync } from 'fs'
import { join } from 'path'
import { picture } from 'xiuxian-img'
//
const helpData = {}
//
const message = new Messages()

const dir = join(process.cwd(), 'public', 'defset', 'base_help.json')

//
message.response(/^(#|\/)?(修仙(帮|幫)助|帮助)$/, async e => {
  const name = 'help'
  if (Object.prototype.hasOwnProperty.call(helpData, name)) {
    e.reply(helpData[name])
    return
  }
  //
  const data = JSON.parse(readFileSync(dir, 'utf-8'))
  // 得 buffer
  helpData[name] = await picture
    .render('HelpComponent', {
      name: 'help',
      props: { data: data }
    })
    .catch(console.error)
  //
  e.reply(helpData[name])
  return
})

message.response(/^(#|\/)?(帮|幫)助打开[\u4e00-\u9fa5]+$/, async e => {
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
  helpData[name] = await picture
    .render('HelpComponent', {
      name: 'help',
      props: { data: [db] }
    })
    .catch(console.error)
  //
  e.reply(helpData[name])
})

//
export const Help = message.ok
