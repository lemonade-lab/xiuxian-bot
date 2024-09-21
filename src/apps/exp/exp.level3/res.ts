import { levelUp } from 'xiuxian-api'
import { operationLock } from 'xiuxian-core'
export default OnResponse(
  async e => {
    /**
     * *******
     * lock start
     * *******
     */
    const T = await operationLock(e.UserId)
    if (!T) {
      e.reply('操作频繁')
      return
    }
    /**
     * lock end
     */

    levelUp(e, 6, 1, 90)
  },
  'message.create',
  /^(#|\/)?突破$/
)
