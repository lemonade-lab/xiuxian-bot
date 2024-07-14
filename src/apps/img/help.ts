import { Controllers, Messages } from 'alemonjs'
import { postHelp } from 'xiuxian-api'
import { Config } from 'xiuxian-core'
const message = new Messages()
message.response(/^(#|\/)?(修仙(帮|幫)助|帮助)$/, async e => {
  Controllers(e).Message.reply('', [
    {
      label: '加入官群',
      link: Config.QQ_GROUP
    },
    {
      label: '地图',
      value: '/地图'
    },
    { label: '控制板', value: '/控制板' }
  ])
  postHelp(e, 'base_help')
  return
})
export const Help = message.ok
