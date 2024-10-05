import { Text, useSend } from 'alemonjs'
import { levelUp } from '@xiuxian/api/index'
import { operationLock } from '@xiuxian/core/index'
export default OnResponse(
  async e => {
    // lock start
    const T = await operationLock(e.UserId)
    const Send = useSend(e)
    if (!T) {
      Send(Text('操作频繁'))
      return
    }

    levelUp(e, 6, 1, 90)
  },
  'message.create',
  /^(#|\/)?突破$/
)
