import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
export default OnResponse(
  async e => {
    const UID = e.UserId

    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return

    // 不是赶路状态
    if (UserData.state == 3) {
      // 取消行为
      const id = await GameApi.Place.get(UID)
      if (id) clearTimeout(id)
      // 清除行为
      GameApi.move.cancelJob(UID)
      e.reply(['已站在原地'], {
        quote: e.msg_id
      })
      return
    }
    if (UserData.state == 4) {
      await GameApi.State.del(UID)
      // 取消行为
      const id = await GameApi.Place.get(UID)
      if (id) {
        clearTimeout(id)
      }
      e.reply(['已取消传送'], {
        quote: e.msg_id
      })
      return
    }
    return
  },
  'message.create',
  /^(#|\/)?返回$/
)
