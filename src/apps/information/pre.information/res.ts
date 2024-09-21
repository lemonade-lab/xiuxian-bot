import { Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const Send = useSend(e)
    Send(Text(e.UserId))
  },
  'message.create',
  /^(#|\/)?我的编号$/
)
