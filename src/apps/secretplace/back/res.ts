import { Text, useSend } from 'alemonjs'
import { isUser } from '@xiuxian/api/index'
import * as GameApi from '@xiuxian/core/index'
export default OnResponse(
  async e => {
    const UID = e.UserId
    const UserData = await isUser(e, UID)
    if (typeof UserData === 'boolean') return
    const Send = useSend(e)
    // 不是赶路状态
    if (UserData.state == 3) {
      // 取消行为
      const id = await GameApi.Place.get(UID)
      if (id) clearTimeout(id)
      // 清除行为
      GameApi.move.cancelJob(UID)
      Send(Text('已取消赶路'))
      return
    }
    if (UserData.state == 4) {
      await GameApi.State.del(UID)
      // 取消行为
      const id = await GameApi.Place.get(UID)
      if (id) {
        clearTimeout(id)
      }
      Send(Text('已取消传送'))
      return
    }
    return
  },
  'message.create',
  /^(#|\/)?返回$/
)
