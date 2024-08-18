import { Messages } from 'alemonjs'
export default new Messages().response(/^(#|\/)?我的编号$/, async e => {
  e.reply(e.user_id)
})
