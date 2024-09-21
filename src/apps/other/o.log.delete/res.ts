import { isUser } from 'xiuxian-api'
import { user_log } from 'xiuxian-db'
export default OnResponse(
  async e => {
    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    user_log.destroy({
      where: {
        uid: UID
      }
    })
    e.reply(['你的的状态记录\n已删除'], {
      quote: e.msg_id
    })
  },
  'message.create',
  /^(#|\/)?删除记录$/
)
