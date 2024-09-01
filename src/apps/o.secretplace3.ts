import { Messages } from 'alemonjs'
import { isUser } from 'xiuxian-api'
import * as GameApi from 'xiuxian-core'
import { user } from 'xiuxian-db'
export default new Messages().response(/^(#|\/)?返回$/, async e => {
  const UID = e.user_id

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
})
