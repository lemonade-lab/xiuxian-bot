import { isUser } from '@xiuxian/api/index'
import { Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    const Send = useSend(e)
    Send(Text('待更新...'))

    return
  },
  'message.create',
  /^(#|\/)?扩建宝库$/
)
