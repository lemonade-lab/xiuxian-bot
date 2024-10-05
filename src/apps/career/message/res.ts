import { Text, useSend } from 'alemonjs'
import { isUser, ControlByBlood } from '@xiuxian/api/index'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    if (!(await ControlByBlood(e, UserData))) return
    const Send = useSend(e)
    Send(Text('[协会执事]😳叶子凡\n暂未开放...'))
  },
  'message.create',
  /^(#|\/)?徽章信息$/
)
