import { Messages } from 'alemonjs'
import { levelUp } from 'xiuxian-api'
import { operationLock } from 'xiuxian-core'
export default new Messages().response(/^(#|\/)?突破$/, async e => {
  /**
   * *******
   * lock start
   * *******
   */
  const T = await operationLock(e.user_id)
  if (!T) {
    e.reply('操作频繁')
    return
  }
  /**
   * lock end
   */

  levelUp(e, 6, 1, 90)
})
