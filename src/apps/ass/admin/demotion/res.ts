import { isUser } from '@xiuxian/api/index'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    //
    const text = useParse(e.Megs, 'Text')

    const uid = text.replace(/^(#|\/)?贬职/, '')

    const Send = useSend(e)

    console.log('uid', uid)

    Send(Text('待更新...'))

    return
  },
  'message.create',
  /^(#|\/)?贬职.*$/
)
