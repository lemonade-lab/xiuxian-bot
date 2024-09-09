import { Messages } from 'alemonjs'
import { readFileSync } from 'fs'
import { join } from 'path'
import { pictureRender } from 'xiuxian-img'
const helpData = {}
const dir = join(process.cwd(), 'public', 'defset', 'base_help.json')
export default new Messages().response(
  /^(#|\/)?(修仙(帮|幫)助|帮助)$/,
  async e => {
    const name = 'help'
    if (Object.prototype.hasOwnProperty.call(helpData, name)) {
      e.reply(helpData[name])
      return
    }
    //
    const data = JSON.parse(readFileSync(dir, 'utf-8'))
    // 得 buffer
    helpData[name] = await pictureRender('HelpComponent', {
      name: name,
      props: { data: data }
    }).catch(console.error)
    //
    e.reply(helpData[name])
    return
  }
)
