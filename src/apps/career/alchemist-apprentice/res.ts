import { Text, useSend } from 'alemonjs'
import { isUser, controlByName } from '@xiuxian/api/index'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    if (!(await controlByName(e, UserData, '协会'))) return
    const Send = useSend(e)
    Send(Text(['[协会执事]😳叶子凡\n', '待开放'].join('')))
  },
  'message.create',
  /^(#|\/)?炼丹师学徒$/
)
