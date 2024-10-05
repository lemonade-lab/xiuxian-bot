import { Text, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
import { user_log } from '@xiuxian/db/index'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const Send = useSend(e)
    user_log.destroy({
      where: {
        uid: UID
      }
    })
    Send(Text('你的的状态记录\n已删除'))
  },
  'message.create',
  /^(#|\/)?删除记录$/
)
