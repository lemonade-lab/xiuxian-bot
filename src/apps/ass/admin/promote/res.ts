import { isUser } from '@xiuxian/api/index'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const text = useParse(e.Megs, 'Text')
    const id = text.replace(/^(#|\/)?提拔/, '')
    if (!id) return

    const Send = useSend(e)

    Send(Text('待更新..'))

    return
  },
  'message.create',
  /^(#|\/)?提拔/
)
