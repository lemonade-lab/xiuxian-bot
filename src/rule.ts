import { Messages } from './alemonjs'
const message = new Messages()

message.response(/^(#|\/)?通天塔奖励$/, async e => {
  e.reply('测试')
})

export default message
