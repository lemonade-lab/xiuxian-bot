import { Text, useSend } from 'alemonjs'
import { levelUp } from 'xiuxian-api'
import { operationLock } from 'xiuxian-core'
export default OnResponse(
  async e => {
    // lock start
    const T = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }

    levelUp(e, 19, 3, 80)
  },
  'message.create',
  /^(#|\/)?(顿悟|頓悟)$/
)
