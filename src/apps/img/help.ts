import { Messages } from 'alemonjs'
import { postHelp } from 'xiuxian-api'
const message = new Messages()
message.response(/^(#|\/)?(修仙(帮|幫)助|帮助)$/, async e => {
  postHelp(e, 'base_help')
  return
})
export const Help = message.ok
